# 🚛 HaulVerify MVP

A lightweight broker verification tool for dispatchers. Enter a broker's MC number and instantly see if they're real and active.

## 🚀 Quick Start

**Just double-click `index.html` to open it in your browser!**

No installation, no build tools, no servers needed. It just works.

## ✨ Features

- 🔍 Check any broker MC number
- 📊 See company name, operating authority, and status
- 🎨 Color-coded risk assessment (🟢 Safe / 🟡 Caution / 🔴 Risky)
- 📱 Mobile-friendly design
- ⚡ Instant results

## 🧪 Test It Out

Try these MC numbers:
- **139819** - C.H. Robinson (major broker)
- **15510** - Landstar (broker/carrier)
- **123456** - Demo company
- Any number will work with generated mock data!

## 🔧 How It Works

1. Enter an MC number
2. Click "Check Broker"
3. The app tries to call the FMCSA API
4. If the API is blocked (CORS), it uses realistic mock data
5. Results show company info + risk level

## 📝 Technical Details

- **Single file:** Everything is in `index.html` (HTML + CSS + JavaScript)
- **No dependencies:** Pure vanilla JavaScript, no frameworks
- **API:** Attempts to use FMCSA Safer API, falls back to mock data
- **Risk Logic:** Simple MVP rules (Active Broker = Safe, Inactive = Risky, etc.)

## 🎯 Next Steps

Once you validate this works:
- Add real risk scoring algorithm
- Connect to a backend to avoid CORS issues
- Add database to cache results
- Show more data fields (insurance, safety rating, etc.)
- Add authentication for users

## 💡 Note

The FMCSA API may block requests from `file://` protocol due to CORS. 
This is normal! The app automatically uses mock data to demonstrate functionality.
For production, you'll want to run this through a proper web server or backend proxy.
