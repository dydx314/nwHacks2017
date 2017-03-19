/* AccelerationMonitor */
function AccelerationMonitor(onInit) {
	this.monitoring = false;
	this.defaultFilter = function(e1,e2) { return true; }
	this.callback = function() {}
	this.currentCallback = function() {}
	this.onInit = onInit;
	this.filter = this.defaultFilter;
	this.prevE = null;

	/* start it up */
	this.currentCallback = this.initialize.bind(this);
	window.addEventListener("devicemotion", this.currentCallback, true);
}

AccelerationMonitor.prototype.start = function(callback) {
	if (!this.monitoring) {
		this.callback = callback;
		this.currentCallback = this.callbackHandler.bind(this);
		window.addEventListener("devicemotion", this.currentCallback, true);
		this.monitoring = true;
	}
}

AccelerationMonitor.prototype.stop = function() {
	if (this.monitoring) {
		window.removeEventListener("devicemotion", this.currentCallback, true);
		this.monitoring = false;
	}
}

AccelerationMonitor.prototype.callbackHandler = function(e) {
	if (this.prevE && this.filter(this.prevE, e)) {
		this.callback(this.prevE, e);
	}
	this.prevE = e;
}

AccelerationMonitor.prototype.initialize = function(e) {
	window.removeEventListener("devicemotion", this.currentCallback, true);
	if (e.accelerationIncludingGravity && e.accelerationIncludingGravity.z != null) {
		this.onInit();
	}
}

/* ShakeMonitor */
function ShakeMonitor(onInit) {
	this.accelerationMonitor = new AccelerationMonitor(onInit);
	this.prevDown = false;
	this.filter = function (e1,e2) {
		var ea1 = e1.accelerationIncludingGravity;
		var ea2 = e2.accelerationIncludingGravity;
	    var z1 = ea1.z;
	    var z2 = ea2.z;

	    return z2-z1 < -1 || z2-z1 > 0.5;
	}
	this.callback = function() {}
}

ShakeMonitor.prototype.monitoring = function () {
	return this.accelerationMonitor.monitoring;
}

ShakeMonitor.prototype.start = function (callback) {
	if (!this.monitoring()) {
		this.callback = callback;
		this.accelerationMonitor.filter = this.filter;
		this.accelerationMonitor.start(this.callbackHandler.bind(this));
	}
}

ShakeMonitor.prototype.stop = function () {
	if (this.monitoring()) {
		this.accelerationMonitor.stop();
	}
}

ShakeMonitor.prototype.callbackHandler = function(e1, e2) {
	var ea1 = e1.accelerationIncludingGravity;
	var ea2 = e2.accelerationIncludingGravity;
    var z1 = ea1.z;
    var z2 = ea2.z;
	
	if (!this.prevDown && z2-z1 < 0) {
		this.callback(e1,e2);
		this.prevDown = true;
	}
	else if (z2-z1 > 0) {
		this.prevDown = false;
	}
}