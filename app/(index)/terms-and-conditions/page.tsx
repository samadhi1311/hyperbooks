import { PageWrapper, Section } from '@/components/ui/layout';
import { A, H1, H2, H3, P } from '@/components/ui/typography';

export default function TermsAndConditions() {
	return (
		<PageWrapper>
			<Section variant='main' className='mx-auto max-w-screen-md space-y-8 py-32'>
				<div className='space-y-4 text-center'>
					<H1>Terms and Conditions</H1>
					<P className='text-muted-foreground' variant='sm'>
						Last updated: 5 <sup>th</sup> March, 2025
					</P>
				</div>

				<div className='space-y-2'>
					<P>
						These Terms and Conditions outline the rules and regulations for using our service. By accessing or using hyperbooks, you agree to comply with these Terms. If you do not agree
						with any part of these Terms, you may not use our service.
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
							<li>Application refers to hyperbooks, the software program provided by the Company.</li>
							<li>Company (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to hyperbooks.</li>
							<li>Service refers to the Application or the Website or both.</li>
							<li>Subscription refers to the recurring digital service plan purchased by You.</li>
							<li>You means the individual accessing or using the Service.</li>
						</ul>
					</div>
				</div>

				<div className='space-y-2'>
					<H2>Use of the Service</H2>
					<ul className='list-inside list-disc pl-8'>
						<li>You must be at least 18 years old to use the Service.</li>
						<li>You are responsible for keeping your account credentials confidential. Credentials must not be shared.</li>
						<li>You must not use the Service for illegal purposes, including fraud or money laundering.</li>
					</ul>
				</div>

				<div className='space-y-2'>
					<H2>Subscription and Refund Policy</H2>
					<ul className='list-inside list-disc pl-8'>
						<li>The Service operates on a subscription model.</li>
						<li>
							Our order process is conducted by our online reseller <A href='https://paddle.com'>Paddle.com</A>. Paddle.com is the Merchant of Record for all our orders. Paddle provides
							all customer service inquiries and handles returns.
						</li>
						<li>You may cancel your subscription anytime via the account settings page. Cancellation prevents future charges but does not provide refunds for prior payments.</li>
					</ul>
				</div>

				<div className='space-y-2'>
					<H2>Data Collection and Usage</H2>
					<ul className='list-inside list-disc pl-8'>
						<li>We collect and analyze data to provide insights and enhance the Service.</li>
						<li>Data analysis is fully automated and does not involve manual review.</li>
						<li>We do not collect information about the nature of your business.</li>
						<li>We do not support fraudulent or illegal transactions and reserve the right to take appropriate action against such activities.</li>
					</ul>
				</div>

				<div className='space-y-2'>
					<H2>Service Availability and Uptime Guarantee</H2>
					<ul className='list-inside list-disc pl-8'>
						<li>We guarantee 99.9% uptime for our Service.</li>
						<li>We are not responsible for outages caused by third-party providers or external factors beyond our control.</li>
					</ul>
				</div>

				<div className='space-y-2'>
					<H2>Prohibited Activities</H2>
					<P>You agree not to:</P>
					<ul className='list-inside list-disc pl-8'>
						<li>Use the Service for illegal purposes.</li>
						<li>Hack, exploit, or bypass service limitations.</li>
						<li>Exceed the allowed usage quota or disrupt normal operations.</li>
					</ul>
				</div>

				<div className='space-y-2'>
					<H2>Limitation of Liability</H2>
					<ul className='list-inside list-disc pl-8'>
						<li>We are not liable for indirect, incidental, or consequential damages resulting from the use or inability to use the Service.</li>
						<li>Our total liability is limited to the amount You paid for the Service in the last 12 months.</li>
					</ul>
				</div>

				<div className='space-y-2'>
					<H2>Termination</H2>
					<ul className='list-inside list-disc pl-8'>
						<li>We reserve the right to suspend or terminate your account if you violate these Terms.</li>
						<li>If your account is terminated, you will lose access to all data and subscription benefits.</li>
					</ul>
				</div>

				<div className='space-y-2'>
					<H2>Changes to These Terms</H2>
					<ul className='list-inside list-disc pl-8'>
						<li>We may update these Terms as necessary. Changes will be notified via email or a notice on our website.</li>
						<li>Your continued use of the Service after changes become effective constitutes your acceptance of the revised Terms.</li>
					</ul>
				</div>

				<div className='space-y-2'>
					<H2>Contact Us</H2>
					<P>
						For any questions regarding these Terms, contact us at: <A href='mailto:hyperbooks@hyperreal.cloud'>hyperbooks@hyperreal.cloud</A>
					</P>
				</div>
			</Section>
		</PageWrapper>
	);
}
