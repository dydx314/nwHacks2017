function GameManager() {
    this.name = "";
	this.salt = 0;
    this.totalRating = 0;
    this.avgRating = 0;
    this.raters = 0;
	this.mv = 0;
	//this.items = {};
	// {"itemName": {"cost": cost, "max": amount}}
	//this.ITEM_COSTS = {"mv": {"cost": 50}, "thing": {"cost": 50, "max": 2}}
	this.callbacks = [];
	this.turbulence = 0;
	this.MAX_TURBULENCE = 100;
	this.MV_TIER = {0: 0.5, 1: 1, 2:2, 3:5, 4:10, 5:20};
	this.MV_COST = {0: 500, 1: 1000, 2:2500, 3:5000, 4:15000};
	this.off = false;
	this.optimal = 100;
	this.tip = 0;
}

GameManager.prototype.setName = function(name) {
    this.name = name;
}

GameManager.prototype.stop = function() {
    this.raters++;
    diff = this.optimal-this.salt;
    if (diff < 0) {
        diff = -diff;
    }
    curRating = 0;
	if(diff/this.optimal < 0.2) {
        curRating = 5;
	}
	else if(diff/this.optimal < 0.4) {
		curRating = 4;
	}
	else if(diff/this.optimal < 0.6) {
		curRating = 3;
	}
    else if(diff/this.optimal < 0.8) {
		curRating = 2;
	}
    else {
		curRating = 1;
	}
    this.tip += 100*curRating*this.MV_TIER[this.mv];
    this.totalRating += curRating;
    this.avgRating = this.totalRating/this.raters;
    this.salt = 0;
    this.optimal = 80 + Math.random()*500;
};

GameManager.prototype.shakeSalt = function(salt) {
	this.turbulence += salt;
	if (this.turbulence > this.MAX_TURBULENCE) {
		this.turbulence = this.MAX_TURBULENCE;
	}
	this.addSalt(salt);
};

GameManager.prototype.addSalt = function(salt) {
	this.salt += salt;
	this.notifyUpdate();
};

GameManager.prototype.decreaseTurbulence = function(turbulence) {
	this.turbulence -= turbulence;
	if (this.turbulence < 0) {
		this.turbulence = 0;
	}
	this.notifyUpdate();
};

GameManager.prototype.getTurbulenceTier = function() {
	if (this.turbulence < 10) {
		return 1;
	}
	else if (gm.turbulence < 25) {
		return 2;
	}
	else if (gm.turbulence < 50) {
		return 3;
	}
	else if (gm.turbulence < 90) {
		return 4;
	}
	else {
		return 5;
	}
};

GameManager.prototype.buyMV = function() {
	if (this.canBuyMV()) {
		// Subtract tip
		this.tip -= this.MV_COST[this.mv];
		// Add item
		this.mv += 1;
		this.notifyUpdate();
	}
};

GameManager.prototype.canBuyMV = function() {
	return this.MV_COST[this.mv] && this.tip >= this.MV_COST[this.mv];
};

/*
GameManager.prototype.purchase = function(item, callback) {
	if (this.canPurchase(item)) {
		// Subtract milk
		this.milk -= this.ITEM_COSTS[item]["cost"];
		// Add item
		if (!this.items[item]) {
			// No item, so create item
			this.items[item] = 0;
		}
		this.items[item] += 1;
		this.notifyUpdate();
	}
};

GameManager.prototype.canPurchase = function(item) {
	var enoughMilk = this.ITEM_COSTS[item] && this.milk >= this.ITEM_COSTS[item]["cost"];
	var belowLimit = !this.ITEM_COSTS[item]["max"] || !this.items[item] || this.items[item] < this.ITEM_COSTS[item]["max"];
	return enoughMilk && belowLimit;
};
*/

GameManager.prototype.addUpdateListener = function(callback) {
	this.callbacks.push(callback);
};

GameManager.prototype.removeUpdateListener = function(callback) {
	var ind = this.callbacks.indexOf(callback);
	if (ind > -1) {
		this.callbacks.splice(ind,1);
	}
};

GameManager.prototype.notifyUpdate = function() {
	this.callbacks.forEach(function (callback) {
		callback();
	})
}
