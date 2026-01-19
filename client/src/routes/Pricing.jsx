import { PricingTable } from '@clerk/clerk-react';
import './Pricing.css';

export default function PricingPage(){
    return(
        <div className="pricing-container">
            <div className="pricing-header">
                <h1 className="pricing-title">Choose Your Plan</h1>
                <p className="pricing-subtitle">
                    Select the perfect plan for your learning journey. All plans include access to our AI-powered study coach.
                </p>
            </div>
            <div className="pricing-content">
                <PricingTable/>
            </div>
        </div>
    )
}

// protecting content example:
//site reference: https://clerk.com/docs/react-router/guides/billing/for-b2c




//                      Example of using Protect - uncomment to use, Declarative mode

//       <Protect
//         plan="bronze"
//         fallback={<p>Only subscribers to the Bronze plan can access this content.</p>}
//       >
//         <h2>Exclusive Bronze Content</h2>
//         <p>This content is only visible to Bronze subscribers.</p>
//       </Protect>