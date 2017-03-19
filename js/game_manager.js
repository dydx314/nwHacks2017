function GameManager() {
	this.milk = 0;
	this.mv = 0;
	//this.items = {};
	// {"itemName": {"cost": cost, "max": amount}}
	//this.ITEM_COSTS = {"mv": {"cost": 50}, "thing": {"cost": 50, "max": 2}}
	this.callbacks = [];
	this.turbulence = 0;
	this.MAX_TURBULENCE = 100;
	this.MV_TIER = {1: 0.1, 2:0.2, 3:0.5, 4:1, 5:2};
	this.MV_COST = {0: 100, 1: 200, 2:500, 3:800, 4:1500};
}

GameManager.prototype.shakeMilk = function(milk) {
	this.turbulence += milk;
	if (this.turbulence > this.MAX_TURBULENCE) {
		this.turbulence = this.MAX_TURBULENCE;
	}
	this.addMilk(milk);
};

GameManager.prototype.addMilk = function(milk) {
	this.milk += milk;
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
		// Subtract milk
		this.milk -= this.MV_COST[this.mv];
		// Add item
		this.mv += 1;
		this.notifyUpdate();
	}
};

GameManager.prototype.canBuyMV = function() {
	return this.MV_COST[this.mv] && this.milk >= this.MV_COST[this.mv];
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
