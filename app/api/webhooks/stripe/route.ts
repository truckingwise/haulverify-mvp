import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase-admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  console.log('🔔 Stripe webhook received')
  
  try {
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('❌ No Stripe signature found')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log('✅ Webhook signature verified')
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('📦 Event type:', event.type)

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      console.log('💳 Checkout session completed:', session.id)
      console.log('📧 Customer email:', session.customer_email)
      console.log('💰 Amount:', session.amount_total)

      const customerEmail = session.customer_email
      const stripeCustomerId = session.customer as string

      if (!customerEmail) {
        console.error('❌ No customer email in session')
        return NextResponse.json({ error: 'No email' }, { status: 400 })
      }

      try {
        const supabaseAdmin = createAdminClient()

        // Check if user already exists
        const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
        
        if (listError) {
          console.error('❌ Error listing users:', listError)
          throw listError
        }

        const existingUser = existingUsers.users.find(u => u.email === customerEmail)

        if (existingUser) {
          console.log('👤 User already exists:', existingUser.id)
          
          // Update user metadata to mark V1 access
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            existingUser.id,
            {
              user_metadata: {
                has_v1_access: true,
                stripe_customer_id: stripeCustomerId,
                purchase_date: new Date().toISOString(),
              },
            }
          )

          if (updateError) {
            console.error('❌ Error updating user:', updateError)
            throw updateError
          }

          console.log('✅ Updated existing user with V1 access')
        } else {
          console.log('👤 Creating new user for:', customerEmail)
          
          // Create new user with V1 access
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true, // Auto-confirm email since they paid
            user_metadata: {
              has_v1_access: true,
              stripe_customer_id: stripeCustomerId,
              purchase_date: new Date().toISOString(),
            },
          })

          if (createError) {
            console.error('❌ Error creating user:', createError)
            throw createError
          }

          console.log('✅ Created new user:', newUser.user?.id)

          // Send magic link email so they can log in
          const { error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: customerEmail,
            options: {
              redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
            },
          })

          if (inviteError) {
            console.error('⚠️ Error generating magic link:', inviteError)
            // Don't throw - user was created, they can request new link
          } else {
            console.log('✅ Magic link generated for new user')
          }
        }

        console.log('🎉 User provisioning complete for:', customerEmail)
        
      } catch (err: any) {
        console.error('❌ Supabase error:', err)
        // Still return 200 to Stripe so it doesn't retry
        // Log the error for investigation
        return NextResponse.json({ 
          received: true, 
          warning: 'User provisioning had issues, check logs' 
        }, { status: 200 })
      }
    }

    // Handle other event types if needed
    if (event.type === 'checkout.session.expired') {
      console.log('⏰ Checkout session expired')
    }

    if (event.type === 'payment_intent.payment_failed') {
      console.log('❌ Payment failed')
    }

    return NextResponse.json({ received: true }, { status: 200 })

  } catch (err: any) {
    console.error('❌ Webhook error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

// Needed to handle raw body for signature verification
export const dynamic = 'force-dynamic'

