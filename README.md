# PDF to Book Creator – Plug & Play

Transform your documents into professional print-ready books with one click via Lulu API.

## Features

- 📄 **Document Upload**: Support for PDF, DOCX, and ODT files
- 📐 **Professional Templates**: 5 book formats with proper margins and bleed
- 🎨 **Cover Design**: Custom covers with AI generation and style gallery
- 💰 **Real-time Pricing**: Instant cost calculation via Lulu API
- 💳 **Secure Payments**: Stripe integration for payment processing
- 🖨️ **One-Click Printing**: Direct integration with Lulu's print-on-demand
- 📊 **Order Tracking**: Real-time status updates and tracking
- 📱 **Responsive Design**: Works on desktop and mobile
- 🤖 **AI Cover Generation**: OpenAI DALL-E integration for custom covers

## Technology Stack

- **React** + **TypeScript** for robust frontend development
- **Tailwind CSS** for responsive styling
- **Shadcn-ui** components for professional UI
- **Stripe** for secure payment processing
- **OpenAI API** for AI-powered cover generation
- **Lulu API** integration for print-on-demand services
- **Vite** for fast development and building

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your API credentials:
```env
# Lulu API (for print-on-demand)
VITE_LULU_CLIENT_ID=your_actual_client_id
VITE_LULU_CLIENT_SECRET=your_actual_client_secret
VITE_LULU_API_BASE=https://api.lulu.com/v1

# Stripe (for payment processing)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# OpenAI (for AI cover generation)
OPENAI_API_KEY=sk-your_openai_api_key

# Development mode
VITE_DEV_MODE=false
```

### 2. API Setup Guide

#### Lulu API Setup
1. Sign up at [Lulu Developer Portal](https://developers.lulu.com/)
2. Create an application and get your client credentials
3. Add credentials to your `.env` file

#### Stripe Setup
1. Create account at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your API keys from the Developers section
3. Add both secret and publishable keys to `.env`
4. Configure webhooks for payment confirmations

#### OpenAI Setup
1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Generate an API key
3. Add to `.env` file
4. Ensure you have credits for DALL-E image generation

### 3. Development Mode

The application runs in **development mode** by default with mock API responses. This allows you to test all features without needing real API credentials.

To use real APIs:
1. Set up all API credentials as described above
2. Set `VITE_DEV_MODE=false`

### 4. Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start backend server (for API endpoints)
node server.js

# Build for production
npm run build
```

## Usage

1. **Upload Document**: Drag and drop your PDF, DOCX, or ODT file
2. **Choose Template**: Select from 5 professional book formats
3. **Design Cover**: Upload custom image or generate with AI
4. **Review Cost**: Get instant pricing with shipping options
5. **Secure Payment**: Pay securely with Stripe integration
6. **Submit Order**: Automatic submission to Lulu after payment confirmation

## API Integration

### Lulu Print-on-Demand API
- **Authentication**: OAuth2 client credentials flow
- **Cost Calculation**: Real-time pricing for different book formats
- **File Validation**: Ensure files meet print quality standards  
- **Print Job Creation**: Submit orders directly to Lulu
- **Status Tracking**: Monitor order progress and shipping

### Stripe Payment Processing
- **Secure Payments**: PCI-compliant payment processing
- **Multiple Payment Methods**: Cards, digital wallets, bank transfers
- **Webhook Integration**: Real-time payment status updates
- **Refund Management**: Automated refund processing

### OpenAI Cover Generation
- **DALL-E Integration**: AI-powered cover image generation
- **Custom Prompts**: Generate covers based on book content
- **Style Variations**: Multiple artistic styles available
- **High Resolution**: Print-ready image quality

## Payment Flow

1. **Cost Calculation**: Real-time pricing via Lulu API
2. **Payment Intent**: Create Stripe payment intent
3. **Secure Payment**: Customer pays via Stripe
4. **Payment Confirmation**: Webhook confirms successful payment
5. **Order Submission**: Automatic submission to Lulu
6. **Order Tracking**: Real-time status updates

## Development Features

- **Mock Mode**: Test all features without API credentials
- **Type Safety**: Full TypeScript coverage
- **Component Library**: Reusable UI components
- **Error Handling**: Comprehensive error states and recovery
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components
- **Payment Security**: PCI-compliant Stripe integration

## Project Structure

```
src/
├── components/          # UI components
│   ├── FileUpload.tsx      # Document upload
│   ├── TemplateSelector.tsx # Book format selection  
│   ├── CoverDesigner.tsx    # Cover customization
│   ├── CostCalculator.tsx   # Pricing calculation
│   └── PrintJobSubmission.tsx # Order processing
├── lib/                # Core utilities
│   ├── lulu-api.ts         # Lulu API integration
│   └── file-utils.ts       # File processing
├── types/              # TypeScript definitions
└── pages/              # Application pages
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

**Ready to turn your documents into professional books!** 📚✨