import { Clerk } from '@clerk/clerk-js'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const clerk = new Clerk(clerkPubKey)
await clerk.load()

// Custom appearance configuration for Clerk components
const appearance = {
  elements: {
    formButtonPrimary: {
      backgroundColor: '#f97316',
      '&:hover': {
        backgroundColor: '#ea580c'
      }
    },
    card: {
      boxShadow: 'none',
      border: 'none',
      backgroundColor: 'transparent'
    },
    headerTitle: {
      color: '#1f2937',
      fontSize: '1.5rem',
      fontWeight: '600'
    },
    headerSubtitle: {
      color: '#6b7280'
    },
    socialButtonsBlockButton: {
      border: '1px solid #e5e7eb',
      '&:hover': {
        backgroundColor: '#f9fafb'
      }
    },
    formFieldInput: {
      border: '1px solid #d1d5db',
      '&:focus': {
        borderColor: '#f97316',
        boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.1)'
      }
    },
    footerActionLink: {
      color: '#f97316',
      '&:hover': {
        color: '#ea580c'
      }
    }
  },
  layout: {
    socialButtonsPlacement: 'top'
  }
}

if (clerk.user) {
  // User is signed in - show success message and redirect
  document.getElementById('app').innerHTML = `
    <div class="text-center">
      <div class="mb-6">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome to Saarthi!</h2>
        <p class="text-gray-600 mb-6">You're now part of the movement driving social change across India.</p>
      </div>
      <div id="user-button" class="mb-6"></div>
      <div class="space-y-3">
        <a href="http://127.0.0.1:3000/campaigns.html" class="block w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
          Explore Campaigns
        </a>
        <a href="http://127.0.0.1:3000/index.html" class="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
          Back to Home
        </a>
      </div>
    </div>
  `

  const userButtonDiv = document.getElementById('user-button')
  clerk.mountUserButton(userButtonDiv, {
    appearance: {
      elements: {
        userButtonAvatarBox: {
          width: '3rem',
          height: '3rem'
        }
      }
    }
  })
} else {
  // User is not signed in - show sign in form
  document.getElementById('app').innerHTML = `
    <div id="sign-in"></div>
  `

  const signInDiv = document.getElementById('sign-in')

  clerk.mountSignIn(signInDiv, {
    appearance,
    afterSignInUrl: window.location.href, // Reload current page after sign in
    signUpUrl: window.location.href // Use same page for sign up
  })
}