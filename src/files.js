import { generateUrl } from '@nextcloud/router'

if ('serviceWorker' in navigator) {
	// Use the window load event to keep the page load performant
	window.addEventListener('load', async () => {
		try {
			const url = generateUrl('apps/end_to_end_encryption/service-worker.js', {}, { noRewrite: true })
			const registration = await navigator.serviceWorker.register(url, { scope: '/' })
			console.debug('SW registered: ', { registration })
		} catch (error) {
			console.error('SW registration failed: ', { error })
		}
	})
} else {
	console.warn('Service Worker is not enabled on this browser.')
}
