import React, { useState } from 'react';
import { Check, Crown, Users, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoginPrompt from '../components/LoginPrompt';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  limits: {
    likes: number;
    comments: number;
    follows: number;
    accounts: number;
  };
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Free',
    period: '',
    description: 'Perfect for getting started with IMVU automation',
    features: [
      '1 post to bulk like per day',
      '1 post to bulk comment per day',
      '1 user to bulk follow per day',
      '30 accounts maximum',
      'Basic support',
      'Community access'
    ],
    limits: {
      likes: 1,
      comments: 1,
      follows: 1,
      accounts: 30
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$2.99',
    period: '/month',
    description: 'Advanced automation with higher limits and priority support',
    features: [
      '5 posts to bulk like per day',
      '5 posts to bulk comment per day',
      '5 users to bulk follow per day',
      '200 accounts maximum',
      'Priority support',
    
    ],
    limits: {
      likes: 5,
      comments: 5,
      follows: 5,
      accounts: 200
    },
    popular: true
  }
];

const Plans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const { user } = useAuth();
  const handlePlanSelect = (planId: string) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (planId === 'premium') {
      setShowPremiumPrompt(true);
      return;
    }
    
    setSelectedPlan(planId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your IMVU automation needs. Upgrade or downgrade at any time.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`
              relative rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-lg
              ${plan.popular 
                ? 'border-primary-500 bg-primary-50 transform scale-105' 
                : 'border-gray-200 bg-white hover:border-primary-300'
              }
              ${selectedPlan === plan.id ? 'ring-4 ring-primary-100' : ''}
            `}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Crown className="w-4 h-4" />
                  <span>Most Popular</span>
                </div>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center space-y-4 mb-8">
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <div className="space-y-2">
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-lg text-gray-600">{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>
            </div>            {/* Usage Limits */}
            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-gray-900 mb-3">Daily Limits</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">{plan.limits.likes} Posts to Like</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">{plan.limits.comments} Posts to Comment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">{plan.limits.follows} Users to Follow</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600">{plan.limits.accounts} Accounts</span>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-8">
              <h4 className="font-semibold text-gray-900">Features</h4>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}            <button
              onClick={() => handlePlanSelect(plan.id)}
              className={`
                w-full py-3 px-6 rounded-lg font-medium text-center transition-all duration-200
                ${plan.popular
                  ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                }
                ${selectedPlan === plan.id ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
              `}
            >
              {selectedPlan === plan.id ? 'Current Plan' : 
               plan.id === 'premium' ? 'Get Premium Access' : 'Select Basic'}
            </button>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Can I change plans anytime?</h4>
              <p className="text-sm text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What happens if I exceed limits?</h4>
              <p className="text-sm text-gray-600">
                Operations will be paused until the next day or you can upgrade to a higher plan.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Is there a free trial?</h4>
              <p className="text-sm text-gray-600">
                The Basic plan is free forever with limited features. Try it risk-free!
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">How secure is my data?</h4>
              <p className="text-sm text-gray-600">
                We use enterprise-grade security and never will ask you for your IMVU account.
              </p>
            </div>
          </div>
        </div>
      </div>      {/* Login Prompt Modal */}
      <LoginPrompt
        isVisible={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        message="You need to be logged in to select a plan."
      />      {/* Premium Activation Modal */}
      {showPremiumPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <Crown className="w-8 h-8 text-primary-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900">Premium Activation Required</h3>
              
              <p className="text-gray-600">
                To activate your Premium plan, please join our Discord server and contact one of our administrators:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-900">Contact:</p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">• <span className="font-medium">Toasty</span></p>
                  <p className="text-sm text-gray-700">• <span className="font-medium">Nightstalker</span></p>
                </div>
              </div>
              
              <div className="space-y-3">
                <a
                  href="https://discord.gg/bBWAKqfyvC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Join Discord Server</span>
                </a>
                
                <button
                  onClick={() => setShowPremiumPrompt(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;
