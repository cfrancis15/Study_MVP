import { PricingTable } from '@clerk/clerk-react';



export default function PricingPage(){
    return(
        <div>
            <h1>Choose your plan</h1>
            <PricingTable/>
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