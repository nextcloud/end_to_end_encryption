$(document).ready(function() {
	// wait for other apps/extensions to register their event handlers and file actions
	// in the "ready" clause
	_.defer(function() {
		OC.Notification.showHtml("<b>Alpha</b> version of end-to-end encryption enabled. <b>Please don't use this in production and only with test data!</b>");
	});
});
