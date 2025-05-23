import { CheckIcon } from '@heroicons/react/solid';
import { useAuth } from '~/pages/Authen/authcontext';
import Subscription from '~/pages/Pricing/subscription.component';

const tiers = [
    {
        name: 'Free',
        id: 'tier-free',
        href: '#',
        priceMonthly: '0 VND',
        description: 'The free plan with standards features',
        features: ['Read stories'],
        featured: false
    },
    {
        name: 'Member',
        id: 'tier-member',
        href: '#',
        priceMonthly: '100.000 VND',
        description: 'Access member-only stories and enjoy an enhanced reading and writing experience.\n' +
            'Cancel anytime',
        features: [
            'Read stories',
            'Write your stories',
            'Response stories'
        ],
        featured: true
    }
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Pricing() {
    const { isMember } = useAuth();

    if ( isMember ) {
        return <Subscription />;
    }

    return (
        <div className="relative isolate bg-white px-6 py-16">
            <div aria-hidden="true"
                 className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
                <div
                    style={ {
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                    } }
                    className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#4ade80] to-[#22c55e] opacity-30"
                />
            </div>
            <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-base/7 font-semibold text-[#419d3f]">Pricing</h2>
                <p className="mt-2 text-5xl text-gray-900 sm:text-6xl font-customs2">
                    Support great writing and access all stories on Medium.
                </p>
            </div>
            <div
                className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
                { tiers.map((tier, tierIdx) => (
                    <div
                        key={ tier.id }
                        className={ classNames(
                            tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0',
                            tier.featured
                                ? ''
                                : tierIdx === 0
                                    ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none'
                                    : 'sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl',
                            'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10'
                        ) }
                    >
                        <h3
                            id={ tier.id }
                            className={ classNames(tier.featured ? 'text-white' : 'text-[#419d3f]', 'text-base/7 font-semibold') }
                        >
                            { tier.name }
                        </h3>
                        <p className="mt-4 flex items-baseline gap-x-2">
              <span
                  className={ classNames(
                      tier.featured ? 'text-white' : 'text-gray-900',
                      'text-5xl font-semibold tracking-tight'
                  ) }
              >
                { tier.priceMonthly }
              </span>
                            <span
                                className={ classNames(tier.featured ? 'text-gray-200' : 'text-[#6b6b6b]', 'text-base') }>/month</span>
                        </p>
                        <p className={ classNames(tier.featured ? 'text-gray-200' : 'text-[#6b6b6b]', 'mt-6 text-base/7 font-customs') }>
                            { tier.description }
                        </p>
                        <ul
                            className={ classNames(
                                tier.featured ? 'text-gray-200' : 'text-[#6b6b6b]',
                                'mt-8 space-y-3 text-sm/6 sm:mt-10'
                            ) }
                        >
                            { tier.features.map((feature) => (
                                <li key={ feature } className="flex gap-x-3">
                                    <CheckIcon
                                        aria-hidden="true"
                                        className={ classNames(tier.featured ? 'text-[#419d3f]' : 'text-[#419d3f]', 'h-6 w-5 flex-none font-customs') }
                                    />
                                    { feature }
                                </li>
                            )) }
                        </ul>
                        <a
                            href="/home/subscription"
                            aria-describedby={ tier.id }
                            className={ classNames(
                                tier.featured
                                    ? 'bg-[#419d3f] text-white shadow-sm hover:hover:bg-[#0f730c] focus-visible:outline-[#0f730c]'
                                    : 'text-[#419d3f] ring-1 ring-inset ring-[#419d3f] hover:ring-indigo-300 focus-visible:outline-indigo-600 pointer-events-none cursor-not-allowed',
                                'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 font-customs'
                            ) }
                        >
                            { !tier.featured ? 'You are free plan now' : 'Upgrade your plan now' }
                        </a>
                    </div>
                )) }
            </div>
        </div>
    );
}