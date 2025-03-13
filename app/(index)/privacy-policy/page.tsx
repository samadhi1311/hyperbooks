import { PageWrapper, Section } from '@/components/ui/layout';
import { H1, H2, H3, P } from '@/components/ui/typography';

export default function PrivacyPolicy() {
	return (
		<PageWrapper>
			<Section variant='main' className='mx-auto max-w-screen-md space-y-8 py-32'>
				<div className='space-y-4 text-center'>
					<H1>Privacy Policy</H1>
					<P className='text-muted-foreground' variant='sm'>
						Last updated: 13 <sup>th</sup> March, 2025
					</P>
				</div>

				<div className='space-y-2'>
					<P>
						This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service and tells You about Your privacy
						rights and how the law protects You.
					</P>
					<P>
						We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
					</P>
				</div>

				<div className='space-y-4'>
					<H2>Interpretation and Definitions</H2>
					<div className='space-y-2'>
						<H3>Interpretation</H3>
						<P>
							The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless
							of whether they appear in singular or in plural.
						</P>
					</div>
					<H3>Definitions</H3>
					<div className='space-y-2'>
						<P>For the purposes of this Privacy Policy:</P>
						<ul className='list-inside list-disc pl-8'>
							<li>Account means a unique account created for You to access our Service or parts of our Service.</li>
							<li>
								Affiliate means an entity that controls, is controlled by, or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the
								shares, equity interest, or other securities entitled to vote for election of directors or other managing authority.
							</li>
							<li>Application refers to hyperbooks, the software program provided by the Company.</li>
							<li>Company (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to hyperbooks.</li>
							<li>Cookies are small files placed on Your device containing browsing history details and other information.</li>
							<li>Country refers to: Sri Lanka</li>
							<li>Device means any device that can access the Service such as a computer, cellphone, or digital tablet.</li>
							<li>Personal Data is any information that relates to an identified or identifiable individual.</li>
							<li>Service refers to the Application or the Website or both.</li>
							<li>Service Provider means any natural or legal person processing the data on behalf of the Company.</li>
							<li>Usage Data refers to data collected automatically from the Service or its infrastructure.</li>
							<li>Website refers to hyperbooks, accessible from https://hyperbooks.app </li>
							<li>You means the individual accessing or using the Service.</li>
						</ul>
					</div>
				</div>

				<div className='space-y-8'>
					<H2>Collecting and Using Your Personal Data</H2>
					<div className='space-y-2'>
						<H3>Types of Data Collected</H3>
						<P variant='lg'>Personal Data</P>
						<P>While using Our Service, We may ask You to provide Us with personally identifiable information, including but not limited to:</P>
						<ul className='list-inside list-disc pl-8'>
							<li>Email address</li>
							<li>First name and last name</li>
							<li>Billing and payment information (processed securely via third-party payment providers)</li>
							<li>Business details (if applicable)</li>
							<li>Usage Data</li>
						</ul>
					</div>

					<div className='space-y-2'>
						<P variant='lg'>Usage Data</P>
						<P>Usage Data is collected automatically when using the Service. This may include:</P>
						<P>When You access the Service via a mobile device, We may collect:</P>
						<ul className='list-inside list-disc pl-8'>
							<li>Mobile device type and unique ID</li>
							<li>Mobile IP address</li>
							<li>Mobile operating system</li>
							<li>Mobile browser type</li>
						</ul>
					</div>

					<div className='space-y-2'>
						<H3>Information Collected while Using the Application</H3>
						<P>With Your prior permission, We may collect:</P>
						<ul className='list-inside list-disc pl-8'>
							<li>Location data</li>
							<li>Camera and photo library data</li>
						</ul>
						<P>You can enable or disable access to this information at any time via Your Device settings.</P>
					</div>
				</div>

				<div className='space-y-8'>
					<div className='space-y-4'>
						<H2>Tracking Technologies and Cookies</H2>
						<P>We use Cookies and similar tracking technologies to track activity on Our Service. These include:</P>
						<ul className='list-inside list-disc pl-8'>
							<li>Session Cookies: Essential for website functionality, deleted after closing the browser.</li>
							<li>Persistent Cookies: Stored on Your device for preference retention.</li>
							<li>Web Beacons: Embedded in emails or pages to analyze user engagement.</li>
						</ul>
						<P>You can manage cookie preferences through Your browser settings.</P>
					</div>
				</div>

				<div className='space-y-8'>
					<div className='space-y-4'>
						<H2>Use of Your Personal Data</H2>
						<P>We use Your Personal Data to:</P>
						<ul className='list-inside list-disc pl-8'>
							<li>Provide and maintain our Service</li>
							<li>Manage Your Account</li>
							<li>Process payments and transactions</li>
							<li>Contact You regarding updates, security alerts, and other notifications</li>
							<li>Provide customer support</li>
							<li>Improve Our Service</li>
							<li>Analyze usage trends</li>
							<li>Prevent fraud</li>
						</ul>
					</div>
				</div>

				<div className='space-y-8'>
					<div className='space-y-4'>
						<H2>Sharing Your Personal Data</H2>
						<P>We may share Your information with:</P>
						<ul className='list-inside list-disc pl-8'>
							<li>Service Providers for analytics, payment processing, and support services</li>
							<li>Affiliates to maintain service continuity</li>
							<li>Business Partners for marketing and promotions (with Your consent)</li>
							<li>Law Enforcement if required by law</li>
							<li>During Business Transfers, such as mergers or acquisitions</li>
						</ul>
					</div>
				</div>

				<div className='space-y-8'>
					<div className='space-y-4'>
						<H2>Retention of Your Personal Data</H2>
						<P>We retain Your Personal Data only as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law.</P>
					</div>
				</div>

				<div className='space-y-8'>
					<div className='space-y-4'>
						<H2>Transfer of Your Personal Data</H2>
						<P>Your data may be transferred and maintained on servers located outside of Your country, where data protection laws may differ.</P>
					</div>
				</div>

				<div className='space-y-8'>
					<div className='space-y-4'>
						<H2>Security of Your Personal Data</H2>
						<P>We implement commercially acceptable security measures, but no transmission method over the internet is 100% secure.</P>
					</div>
				</div>

				<div className='space-y-8'>
					<div className='space-y-4'>
						<H2>Your Rights</H2>
						<P>You have the right to:</P>
						<ul className='list-inside list-disc pl-8'>
							<li>Access, update, or delete Your Personal Data</li>
							<li>Withdraw consent for data processing</li>
							<li>Request a copy of Your Personal Data</li>
						</ul>
						<P>To exercise these rights, please contact Us at hyperbooks@hyperreal.cloud.</P>
					</div>
				</div>

				<div className='space-y-8'>
					<div className='space-y-4'>
						<H2>Children&apos;s Privacy</H2>
						<P>Our Service is not intended for children under 13. We do not knowingly collect Personal Data from children.</P>
					</div>
				</div>

				<div className='space-y-8'>
					<div className='space-y-4'>
						<H2>Third-Party Links</H2>
						<P>Our Service may contain links to third-party websites. We are not responsible for their privacy practices.</P>
					</div>
				</div>

				<div className='space-y-8'>
					<div className='space-y-4'>
						<H2>Changes to This Privacy Policy</H2>
						<P>We may update this Privacy Policy from time to time. We will notify You of any significant changes.</P>
					</div>
				</div>

				<div className='space-y-8'>
					<div className='space-y-4'>
						<H2>Contact Us</H2>
						<P>For any questions about this Privacy Policy, contact Us at: hyperbooks@hyperreal.cloud</P>
					</div>
				</div>
			</Section>
		</PageWrapper>
	);
}
