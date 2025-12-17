import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  console.log('🔔 Stripe webhook received')
  
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('❌ No Stripe signature found')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log('✅ Webhook signature verified')
    } catch (err) {
      console.error('❌ Webhook signature verification failed')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('📦 Event type:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      console.log('💳 Checkout session completed:', session.id)
      console.log('📧 Customer email:', session.customer_email)

      const customerEmail = session.customer_email
      const stripeCustomerId = session.customer as string

      if (!customerEmail) {
        console.error('❌ No customer email in session')
        return NextResponse.json({ error: 'No email' }, { status: 400 })
      }

      try {
        const supabaseAdmin = createAdminClient()

        // Try to create new user
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: customerEmail,
          email_confirm: true,
          user_metadata: {
            has_v1_access: true,
            stripe_customer_id: stripeCustomerId,
            purchase_date: new Date().toISOString(),
          },
        })

        if (createError) {
          console.log('👤 User may already exist, updating metadata...')
          
          // User exists - update their metadata to grant access
          const { data: usersData } = await supabaseAdmin.auth.admin.listUsers()
          const existingUser = usersData?.users?.find((u: any) => u.email === customerEmail)
          
          if (existingUser) {
            await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
              user_metadata: {
                ...existingUser.user_metadata,
                has_v1_access: true,
                stripe_customer_id: stripeCustomerId,
                purchase_date: new Date().toISOString(),
              },
            })
            console.log('✅ Updated existing user with V1 access:', existingUser.id)
          }
        } else {
          console.log('✅ Created new user:', newUser.user?.id)
        }

        console.log('🎉 Webhook processed for:', customerEmail)
        
      } catch (err) {
        console.error('❌ Supabase error')
        return NextResponse.json({ 
          received: true, 
          warning: 'User provisioning had issues' 
        }, { status: 200 })
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })

  } catch (err) {
    console.error('❌ Webhook error')
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
