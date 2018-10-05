﻿var cr = {};
cr.plugins_ = {};
cr.behaviors = {};
if (typeof Object.getPrototypeOf !== "function")
{
	if (typeof "test".__proto__ === "object")
	{
		Object.getPrototypeOf = function(object) {
			return object.__proto__;
		};
	}
	else
	{
		Object.getPrototypeOf = function(object) {
			return object.constructor.prototype;
		};
	}
}
(function(){
	cr.logexport = function (msg)
	{
		if (window.console && window.console.log)
			window.console.log(msg);
	};
	cr.logerror = function (msg)
	{
		if (window.console && window.console.error)
			window.console.error(msg);
	};
	cr.seal = function(x)
	{
		return x;
	};
	cr.freeze = function(x)
	{
		return x;
	};
	cr.is_undefined = function (x)
	{
		return typeof x === "undefined";
	};
	cr.is_number = function (x)
	{
		return typeof x === "number";
	};
	cr.is_string = function (x)
	{
		return typeof x === "string";
	};
	cr.isPOT = function (x)
	{
		return x > 0 && ((x - 1) & x) === 0;
	};
	cr.nextHighestPowerOfTwo = function(x) {
		--x;
		for (var i = 1; i < 32; i <<= 1) {
			x = x | x >> i;
		}
		return x + 1;
	}
	cr.abs = function (x)
	{
		return (x < 0 ? -x : x);
	};
	cr.max = function (a, b)
	{
		return (a > b ? a : b);
	};
	cr.min = function (a, b)
	{
		return (a < b ? a : b);
	};
	cr.PI = Math.PI;
	cr.round = function (x)
	{
		return (x + 0.5) | 0;
	};
	cr.floor = function (x)
	{
		if (x >= 0)
			return x | 0;
		else
			return (x | 0) - 1;		// correctly round down when negative
	};
	cr.ceil = function (x)
	{
		var f = x | 0;
		return (f === x ? f : f + 1);
	};
	function Vector2(x, y)
	{
		this.x = x;
		this.y = y;
		cr.seal(this);
	};
	Vector2.prototype.offset = function (px, py)
	{
		this.x += px;
		this.y += py;
		return this;
	};
	Vector2.prototype.mul = function (px, py)
	{
		this.x *= px;
		this.y *= py;
		return this;
	};
	cr.vector2 = Vector2;
	cr.segments_intersect = function(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y)
	{
		var max_ax, min_ax, max_ay, min_ay, max_bx, min_bx, max_by, min_by;
		if (a1x < a2x)
		{
			min_ax = a1x;
			max_ax = a2x;
		}
		else
		{
			min_ax = a2x;
			max_ax = a1x;
		}
		if (b1x < b2x)
		{
			min_bx = b1x;
			max_bx = b2x;
		}
		else
		{
			min_bx = b2x;
			max_bx = b1x;
		}
		if (max_ax < min_bx || min_ax > max_bx)
			return false;
		if (a1y < a2y)
		{
			min_ay = a1y;
			max_ay = a2y;
		}
		else
		{
			min_ay = a2y;
			max_ay = a1y;
		}
		if (b1y < b2y)
		{
			min_by = b1y;
			max_by = b2y;
		}
		else
		{
			min_by = b2y;
			max_by = b1y;
		}
		if (max_ay < min_by || min_ay > max_by)
			return false;
		var dpx = b1x - a1x + b2x - a2x;
		var dpy = b1y - a1y + b2y - a2y;
		var qax = a2x - a1x;
		var qay = a2y - a1y;
		var qbx = b2x - b1x;
		var qby = b2y - b1y;
		var d = cr.abs(qay * qbx - qby * qax);
		var la = qbx * dpy - qby * dpx;
		if (cr.abs(la) > d)
			return false;
		var lb = qax * dpy - qay * dpx;
		return cr.abs(lb) <= d;
	};
	function Rect(left, top, right, bottom)
	{
		this.set(left, top, right, bottom);
		cr.seal(this);
	};
	Rect.prototype.set = function (left, top, right, bottom)
	{
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
	};
	Rect.prototype.copy = function (r)
	{
		this.left = r.left;
		this.top = r.top;
		this.right = r.right;
		this.bottom = r.bottom;
	};
	Rect.prototype.width = function ()
	{
		return this.right - this.left;
	};
	Rect.prototype.height = function ()
	{
		return this.bottom - this.top;
	};
	Rect.prototype.offset = function (px, py)
	{
		this.left += px;
		this.top += py;
		this.right += px;
		this.bottom += py;
		return this;
	};
	Rect.prototype.normalize = function ()
	{
		var temp = 0;
		if (this.left > this.right)
		{
			temp = this.left;
			this.left = this.right;
			this.right = temp;
		}
		if (this.top > this.bottom)
		{
			temp = this.top;
			this.top = this.bottom;
			this.bottom = temp;
		}
	};
	Rect.prototype.intersects_rect = function (rc)
	{
		return !(rc.right < this.left || rc.bottom < this.top || rc.left > this.right || rc.top > this.bottom);
	};
	Rect.prototype.intersects_rect_off = function (rc, ox, oy)
	{
		return !(rc.right + ox < this.left || rc.bottom + oy < this.top || rc.left + ox > this.right || rc.top + oy > this.bottom);
	};
	Rect.prototype.contains_pt = function (x, y)
	{
		return (x >= this.left && x <= this.right) && (y >= this.top && y <= this.bottom);
	};
	Rect.prototype.equals = function (r)
	{
		return this.left === r.left && this.top === r.top && this.right === r.right && this.bottom === r.bottom;
	};
	cr.rect = Rect;
	function Quad()
	{
		this.tlx = 0;
		this.tly = 0;
		this.trx = 0;
		this.try_ = 0;	// is a keyword otherwise!
		this.brx = 0;
		this.bry = 0;
		this.blx = 0;
		this.bly = 0;
		cr.seal(this);
	};
	Quad.prototype.set_from_rect = function (rc)
	{
		this.tlx = rc.left;
		this.tly = rc.top;
		this.trx = rc.right;
		this.try_ = rc.top;
		this.brx = rc.right;
		this.bry = rc.bottom;
		this.blx = rc.left;
		this.bly = rc.bottom;
	};
	Quad.prototype.set_from_rotated_rect = function (rc, a)
	{
		if (a === 0)
		{
			this.set_from_rect(rc);
		}
		else
		{
			var sin_a = Math.sin(a);
			var cos_a = Math.cos(a);
			var left_sin_a = rc.left * sin_a;
			var top_sin_a = rc.top * sin_a;
			var right_sin_a = rc.right * sin_a;
			var bottom_sin_a = rc.bottom * sin_a;
			var left_cos_a = rc.left * cos_a;
			var top_cos_a = rc.top * cos_a;
			var right_cos_a = rc.right * cos_a;
			var bottom_cos_a = rc.bottom * cos_a;
			this.tlx = left_cos_a - top_sin_a;
			this.tly = top_cos_a + left_sin_a;
			this.trx = right_cos_a - top_sin_a;
			this.try_ = top_cos_a + right_sin_a;
			this.brx = right_cos_a - bottom_sin_a;
			this.bry = bottom_cos_a + right_sin_a;
			this.blx = left_cos_a - bottom_sin_a;
			this.bly = bottom_cos_a + left_sin_a;
		}
	};
	Quad.prototype.offset = function (px, py)
	{
		this.tlx += px;
		this.tly += py;
		this.trx += px;
		this.try_ += py;
		this.brx += px;
		this.bry += py;
		this.blx += px;
		this.bly += py;
		return this;
	};
	var minresult = 0;
	var maxresult = 0;
	function minmax4(a, b, c, d)
	{
		if (a < b)
		{
			if (c < d)
			{
				if (a < c)
					minresult = a;
				else
					minresult = c;
				if (b > d)
					maxresult = b;
				else
					maxresult = d;
			}
			else
			{
				if (a < d)
					minresult = a;
				else
					minresult = d;
				if (b > c)
					maxresult = b;
				else
					maxresult = c;
			}
		}
		else
		{
			if (c < d)
			{
				if (b < c)
					minresult = b;
				else
					minresult = c;
				if (a > d)
					maxresult = a;
				else
					maxresult = d;
			}
			else
			{
				if (b < d)
					minresult = b;
				else
					minresult = d;
				if (a > c)
					maxresult = a;
				else
					maxresult = c;
			}
		}
	};
	Quad.prototype.bounding_box = function (rc)
	{
		minmax4(this.tlx, this.trx, this.brx, this.blx);
		rc.left = minresult;
		rc.right = maxresult;
		minmax4(this.tly, this.try_, this.bry, this.bly);
		rc.top = minresult;
		rc.bottom = maxresult;
	};
	Quad.prototype.contains_pt = function (x, y)
	{
		var tlx = this.tlx;
		var tly = this.tly;
		var v0x = this.trx - tlx;
		var v0y = this.try_ - tly;
		var v1x = this.brx - tlx;
		var v1y = this.bry - tly;
		var v2x = x - tlx;
		var v2y = y - tly;
		var dot00 = v0x * v0x + v0y * v0y
		var dot01 = v0x * v1x + v0y * v1y
		var dot02 = v0x * v2x + v0y * v2y
		var dot11 = v1x * v1x + v1y * v1y
		var dot12 = v1x * v2x + v1y * v2y
		var invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
		var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
		if ((u >= 0.0) && (v > 0.0) && (u + v < 1))
			return true;
		v0x = this.blx - tlx;
		v0y = this.bly - tly;
		var dot00 = v0x * v0x + v0y * v0y
		var dot01 = v0x * v1x + v0y * v1y
		var dot02 = v0x * v2x + v0y * v2y
		invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
		u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		v = (dot00 * dot12 - dot01 * dot02) * invDenom;
		return (u >= 0.0) && (v > 0.0) && (u + v < 1);
	};
	Quad.prototype.at = function (i, xory)
	{
		if (xory)
		{
			switch (i)
			{
				case 0: return this.tlx;
				case 1: return this.trx;
				case 2: return this.brx;
				case 3: return this.blx;
				case 4: return this.tlx;
				default: return this.tlx;
			}
		}
		else
		{
			switch (i)
			{
				case 0: return this.tly;
				case 1: return this.try_;
				case 2: return this.bry;
				case 3: return this.bly;
				case 4: return this.tly;
				default: return this.tly;
			}
		}
	};
	Quad.prototype.midX = function ()
	{
		return (this.tlx + this.trx  + this.brx + this.blx) / 4;
	};
	Quad.prototype.midY = function ()
	{
		return (this.tly + this.try_ + this.bry + this.bly) / 4;
	};
	Quad.prototype.intersects_segment = function (x1, y1, x2, y2)
	{
		if (this.contains_pt(x1, y1) || this.contains_pt(x2, y2))
			return true;
		var a1x, a1y, a2x, a2y;
		var i;
		for (i = 0; i < 4; i++)
		{
			a1x = this.at(i, true);
			a1y = this.at(i, false);
			a2x = this.at(i + 1, true);
			a2y = this.at(i + 1, false);
			if (cr.segments_intersect(x1, y1, x2, y2, a1x, a1y, a2x, a2y))
				return true;
		}
		return false;
	};
	Quad.prototype.intersects_quad = function (rhs)
	{
		var midx = rhs.midX();
		var midy = rhs.midY();
		if (this.contains_pt(midx, midy))
			return true;
		midx = this.midX();
		midy = this.midY();
		if (rhs.contains_pt(midx, midy))
			return true;
		var a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y;
		var i, j;
		for (i = 0; i < 4; i++)
		{
			for (j = 0; j < 4; j++)
			{
				a1x = this.at(i, true);
				a1y = this.at(i, false);
				a2x = this.at(i + 1, true);
				a2y = this.at(i + 1, false);
				b1x = rhs.at(j, true);
				b1y = rhs.at(j, false);
				b2x = rhs.at(j + 1, true);
				b2y = rhs.at(j + 1, false);
				if (cr.segments_intersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y))
					return true;
			}
		}
		return false;
	};
	cr.quad = Quad;
	cr.RGB = function (red, green, blue)
	{
		return Math.max(Math.min(red, 255), 0)
			 | (Math.max(Math.min(green, 255), 0) << 8)
			 | (Math.max(Math.min(blue, 255), 0) << 16);
	};
	cr.GetRValue = function (rgb)
	{
		return rgb & 0xFF;
	};
	cr.GetGValue = function (rgb)
	{
		return (rgb & 0xFF00) >> 8;
	};
	cr.GetBValue = function (rgb)
	{
		return (rgb & 0xFF0000) >> 16;
	};
	cr.shallowCopy = function (a, b, allowOverwrite)
	{
		var attr;
		for (attr in b)
		{
			if (b.hasOwnProperty(attr))
			{
;
				a[attr] = b[attr];
			}
		}
		return a;
	};
	cr.arrayRemove = function (arr, index)
	{
		var i, len;
		index = cr.floor(index);
		if (index < 0 || index >= arr.length)
			return;							// index out of bounds
		for (i = index, len = arr.length - 1; i < len; i++)
			arr[i] = arr[i + 1];
		cr.truncateArray(arr, len);
	};
	cr.truncateArray = function (arr, index)
	{
		arr.length = index;
	};
	cr.clearArray = function (arr)
	{
		cr.truncateArray(arr, 0);
	};
	cr.shallowAssignArray = function (dest, src)
	{
		cr.clearArray(dest);
		var i, len;
		for (i = 0, len = src.length; i < len; ++i)
			dest[i] = src[i];
	};
	cr.appendArray = function (a, b)
	{
		a.push.apply(a, b);
	};
	cr.fastIndexOf = function (arr, item)
	{
		var i, len;
		for (i = 0, len = arr.length; i < len; ++i)
		{
			if (arr[i] === item)
				return i;
		}
		return -1;
	};
	cr.arrayFindRemove = function (arr, item)
	{
		var index = cr.fastIndexOf(arr, item);
		if (index !== -1)
			cr.arrayRemove(arr, index);
	};
	cr.clamp = function(x, a, b)
	{
		if (x < a)
			return a;
		else if (x > b)
			return b;
		else
			return x;
	};
	cr.to_radians = function(x)
	{
		return x / (180.0 / cr.PI);
	};
	cr.to_degrees = function(x)
	{
		return x * (180.0 / cr.PI);
	};
	cr.clamp_angle_degrees = function (a)
	{
		a %= 360;       // now in (-360, 360) range
		if (a < 0)
			a += 360;   // now in [0, 360) range
		return a;
	};
	cr.clamp_angle = function (a)
	{
		a %= 2 * cr.PI;       // now in (-2pi, 2pi) range
		if (a < 0)
			a += 2 * cr.PI;   // now in [0, 2pi) range
		return a;
	};
	cr.to_clamped_degrees = function (x)
	{
		return cr.clamp_angle_degrees(cr.to_degrees(x));
	};
	cr.to_clamped_radians = function (x)
	{
		return cr.clamp_angle(cr.to_radians(x));
	};
	cr.angleTo = function(x1, y1, x2, y2)
	{
		var dx = x2 - x1;
        var dy = y2 - y1;
		return Math.atan2(dy, dx);
	};
	cr.angleDiff = function (a1, a2)
	{
		if (a1 === a2)
			return 0;
		var s1 = Math.sin(a1);
		var c1 = Math.cos(a1);
		var s2 = Math.sin(a2);
		var c2 = Math.cos(a2);
		var n = s1 * s2 + c1 * c2;
		if (n >= 1)
			return 0;
		if (n <= -1)
			return cr.PI;
		return Math.acos(n);
	};
	cr.angleRotate = function (start, end, step)
	{
		var ss = Math.sin(start);
		var cs = Math.cos(start);
		var se = Math.sin(end);
		var ce = Math.cos(end);
		if (Math.acos(ss * se + cs * ce) > step)
		{
			if (cs * se - ss * ce > 0)
				return cr.clamp_angle(start + step);
			else
				return cr.clamp_angle(start - step);
		}
		else
			return cr.clamp_angle(end);
	};
	cr.angleClockwise = function (a1, a2)
	{
		var s1 = Math.sin(a1);
		var c1 = Math.cos(a1);
		var s2 = Math.sin(a2);
		var c2 = Math.cos(a2);
		return c1 * s2 - s1 * c2 <= 0;
	};
	cr.rotatePtAround = function (px, py, a, ox, oy, getx)
	{
		if (a === 0)
			return getx ? px : py;
		var sin_a = Math.sin(a);
		var cos_a = Math.cos(a);
		px -= ox;
		py -= oy;
		var left_sin_a = px * sin_a;
		var top_sin_a = py * sin_a;
		var left_cos_a = px * cos_a;
		var top_cos_a = py * cos_a;
		px = left_cos_a - top_sin_a;
		py = top_cos_a + left_sin_a;
		px += ox;
		py += oy;
		return getx ? px : py;
	}
	cr.distanceTo = function(x1, y1, x2, y2)
	{
		var dx = x2 - x1;
        var dy = y2 - y1;
		return Math.sqrt(dx*dx + dy*dy);
	};
	cr.xor = function (x, y)
	{
		return !x !== !y;
	};
	cr.lerp = function (a, b, x)
	{
		return a + (b - a) * x;
	};
	cr.unlerp = function (a, b, c)
	{
		if (a === b)
			return 0;		// avoid divide by 0
		return (c - a) / (b - a);
	};
	cr.anglelerp = function (a, b, x)
	{
		var diff = cr.angleDiff(a, b);
		if (cr.angleClockwise(b, a))
		{
			return a + diff * x;
		}
		else
		{
			return a - diff * x;
		}
	};
	cr.qarp = function (a, b, c, x)
	{
		return cr.lerp(cr.lerp(a, b, x), cr.lerp(b, c, x), x);
	};
	cr.cubic = function (a, b, c, d, x)
	{
		return cr.lerp(cr.qarp(a, b, c, x), cr.qarp(b, c, d, x), x);
	};
	cr.cosp = function (a, b, x)
	{
		return (a + b + (a - b) * Math.cos(x * Math.PI)) / 2;
	};
	cr.hasAnyOwnProperty = function (o)
	{
		var p;
		for (p in o)
		{
			if (o.hasOwnProperty(p))
				return true;
		}
		return false;
	};
	cr.wipe = function (obj)
	{
		var p;
		for (p in obj)
		{
			if (obj.hasOwnProperty(p))
				delete obj[p];
		}
	};
	var startup_time = +(new Date());
	cr.performance_now = function()
	{
		if (typeof window["performance"] !== "undefined")
		{
			var winperf = window["performance"];
			if (typeof winperf.now !== "undefined")
				return winperf.now();
			else if (typeof winperf["webkitNow"] !== "undefined")
				return winperf["webkitNow"]();
			else if (typeof winperf["mozNow"] !== "undefined")
				return winperf["mozNow"]();
			else if (typeof winperf["msNow"] !== "undefined")
				return winperf["msNow"]();
		}
		return Date.now() - startup_time;
	};
	var isChrome = false;
	var isSafari = false;
	var isiOS = false;
	var isEjecta = false;
	if (typeof window !== "undefined")		// not c2 editor
	{
		isChrome = /chrome/i.test(navigator.userAgent) || /chromium/i.test(navigator.userAgent);
		isSafari = !isChrome && /safari/i.test(navigator.userAgent);
		isiOS = /(iphone|ipod|ipad)/i.test(navigator.userAgent);
		isEjecta = window["c2ejecta"];
	}
	var supports_set = ((!isSafari && !isEjecta && !isiOS) && (typeof Set !== "undefined" && typeof Set.prototype["forEach"] !== "undefined"));
	function ObjectSet_()
	{
		this.s = null;
		this.items = null;			// lazy allocated (hopefully results in better GC performance)
		this.item_count = 0;
		if (supports_set)
		{
			this.s = new Set();
		}
		this.values_cache = [];
		this.cache_valid = true;
		cr.seal(this);
	};
	ObjectSet_.prototype.contains = function (x)
	{
		if (this.isEmpty())
			return false;
		if (supports_set)
			return this.s["has"](x);
		else
			return (this.items && this.items.hasOwnProperty(x));
	};
	ObjectSet_.prototype.add = function (x)
	{
		if (supports_set)
		{
			if (!this.s["has"](x))
			{
				this.s["add"](x);
				this.cache_valid = false;
			}
		}
		else
		{
			var str = x.toString();
			var items = this.items;
			if (!items)
			{
				this.items = {};
				this.items[str] = x;
				this.item_count = 1;
				this.cache_valid = false;
			}
			else if (!items.hasOwnProperty(str))
			{
				items[str] = x;
				this.item_count++;
				this.cache_valid = false;
			}
		}
	};
	ObjectSet_.prototype.remove = function (x)
	{
		if (this.isEmpty())
			return;
		if (supports_set)
		{
			if (this.s["has"](x))
			{
				this.s["delete"](x);
				this.cache_valid = false;
			}
		}
		else if (this.items)
		{
			var str = x.toString();
			var items = this.items;
			if (items.hasOwnProperty(str))
			{
				delete items[str];
				this.item_count--;
				this.cache_valid = false;
			}
		}
	};
	ObjectSet_.prototype.clear = function (/*wipe_*/)
	{
		if (this.isEmpty())
			return;
		if (supports_set)
		{
			this.s["clear"]();			// best!
		}
		else
		{
				this.items = null;		// creates garbage; will lazy allocate on next add()
			this.item_count = 0;
		}
		cr.clearArray(this.values_cache);
		this.cache_valid = true;
	};
	ObjectSet_.prototype.isEmpty = function ()
	{
		return this.count() === 0;
	};
	ObjectSet_.prototype.count = function ()
	{
		if (supports_set)
			return this.s["size"];
		else
			return this.item_count;
	};
	var current_arr = null;
	var current_index = 0;
	function set_append_to_arr(x)
	{
		current_arr[current_index++] = x;
	};
	ObjectSet_.prototype.update_cache = function ()
	{
		if (this.cache_valid)
			return;
		if (supports_set)
		{
			cr.clearArray(this.values_cache);
			current_arr = this.values_cache;
			current_index = 0;
			this.s["forEach"](set_append_to_arr);
;
			current_arr = null;
			current_index = 0;
		}
		else
		{
			var values_cache = this.values_cache;
			cr.clearArray(values_cache);
			var p, n = 0, items = this.items;
			if (items)
			{
				for (p in items)
				{
					if (items.hasOwnProperty(p))
						values_cache[n++] = items[p];
				}
			}
;
		}
		this.cache_valid = true;
	};
	ObjectSet_.prototype.valuesRef = function ()
	{
		this.update_cache();
		return this.values_cache;
	};
	cr.ObjectSet = ObjectSet_;
	var tmpSet = new cr.ObjectSet();
	cr.removeArrayDuplicates = function (arr)
	{
		var i, len;
		for (i = 0, len = arr.length; i < len; ++i)
		{
			tmpSet.add(arr[i]);
		}
		cr.shallowAssignArray(arr, tmpSet.valuesRef());
		tmpSet.clear();
	};
	cr.arrayRemoveAllFromObjectSet = function (arr, remset)
	{
		if (supports_set)
			cr.arrayRemoveAll_set(arr, remset.s);
		else
			cr.arrayRemoveAll_arr(arr, remset.valuesRef());
	};
	cr.arrayRemoveAll_set = function (arr, s)
	{
		var i, j, len, item;
		for (i = 0, j = 0, len = arr.length; i < len; ++i)
		{
			item = arr[i];
			if (!s["has"](item))					// not an item to remove
				arr[j++] = item;					// keep it
		}
		cr.truncateArray(arr, j);
	};
	cr.arrayRemoveAll_arr = function (arr, rem)
	{
		var i, j, len, item;
		for (i = 0, j = 0, len = arr.length; i < len; ++i)
		{
			item = arr[i];
			if (cr.fastIndexOf(rem, item) === -1)	// not an item to remove
				arr[j++] = item;					// keep it
		}
		cr.truncateArray(arr, j);
	};
	function KahanAdder_()
	{
		this.c = 0;
        this.y = 0;
        this.t = 0;
        this.sum = 0;
		cr.seal(this);
	};
	KahanAdder_.prototype.add = function (v)
	{
		this.y = v - this.c;
	    this.t = this.sum + this.y;
	    this.c = (this.t - this.sum) - this.y;
	    this.sum = this.t;
	};
    KahanAdder_.prototype.reset = function ()
    {
        this.c = 0;
        this.y = 0;
        this.t = 0;
        this.sum = 0;
    };
	cr.KahanAdder = KahanAdder_;
	cr.regexp_escape = function(text)
	{
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};
	function CollisionPoly_(pts_array_)
	{
		this.pts_cache = [];
		this.bboxLeft = 0;
		this.bboxTop = 0;
		this.bboxRight = 0;
		this.bboxBottom = 0;
		this.convexpolys = null;		// for physics behavior to cache separated polys
		this.set_pts(pts_array_);
		cr.seal(this);
	};
	CollisionPoly_.prototype.set_pts = function(pts_array_)
	{
		this.pts_array = pts_array_;
		this.pts_count = pts_array_.length / 2;			// x, y, x, y... in array
		this.pts_cache.length = pts_array_.length;
		this.cache_width = -1;
		this.cache_height = -1;
		this.cache_angle = 0;
	};
	CollisionPoly_.prototype.is_empty = function()
	{
		return !this.pts_array.length;
	};
	CollisionPoly_.prototype.update_bbox = function ()
	{
		var myptscache = this.pts_cache;
		var bboxLeft_ = myptscache[0];
		var bboxRight_ = bboxLeft_;
		var bboxTop_ = myptscache[1];
		var bboxBottom_ = bboxTop_;
		var x, y, i = 1, i2, len = this.pts_count;
		for ( ; i < len; ++i)
		{
			i2 = i*2;
			x = myptscache[i2];
			y = myptscache[i2+1];
			if (x < bboxLeft_)
				bboxLeft_ = x;
			if (x > bboxRight_)
				bboxRight_ = x;
			if (y < bboxTop_)
				bboxTop_ = y;
			if (y > bboxBottom_)
				bboxBottom_ = y;
		}
		this.bboxLeft = bboxLeft_;
		this.bboxRight = bboxRight_;
		this.bboxTop = bboxTop_;
		this.bboxBottom = bboxBottom_;
	};
	CollisionPoly_.prototype.set_from_rect = function(rc, offx, offy)
	{
		this.pts_cache.length = 8;
		this.pts_count = 4;
		var myptscache = this.pts_cache;
		myptscache[0] = rc.left - offx;
		myptscache[1] = rc.top - offy;
		myptscache[2] = rc.right - offx;
		myptscache[3] = rc.top - offy;
		myptscache[4] = rc.right - offx;
		myptscache[5] = rc.bottom - offy;
		myptscache[6] = rc.left - offx;
		myptscache[7] = rc.bottom - offy;
		this.cache_width = rc.right - rc.left;
		this.cache_height = rc.bottom - rc.top;
		this.update_bbox();
	};
	CollisionPoly_.prototype.set_from_quad = function(q, offx, offy, w, h)
	{
		this.pts_cache.length = 8;
		this.pts_count = 4;
		var myptscache = this.pts_cache;
		myptscache[0] = q.tlx - offx;
		myptscache[1] = q.tly - offy;
		myptscache[2] = q.trx - offx;
		myptscache[3] = q.try_ - offy;
		myptscache[4] = q.brx - offx;
		myptscache[5] = q.bry - offy;
		myptscache[6] = q.blx - offx;
		myptscache[7] = q.bly - offy;
		this.cache_width = w;
		this.cache_height = h;
		this.update_bbox();
	};
	CollisionPoly_.prototype.set_from_poly = function (r)
	{
		this.pts_count = r.pts_count;
		cr.shallowAssignArray(this.pts_cache, r.pts_cache);
		this.bboxLeft = r.bboxLeft;
		this.bboxTop - r.bboxTop;
		this.bboxRight = r.bboxRight;
		this.bboxBottom = r.bboxBottom;
	};
	CollisionPoly_.prototype.cache_poly = function(w, h, a)
	{
		if (this.cache_width === w && this.cache_height === h && this.cache_angle === a)
			return;		// cache up-to-date
		this.cache_width = w;
		this.cache_height = h;
		this.cache_angle = a;
		var i, i2, i21, len, x, y;
		var sina = 0;
		var cosa = 1;
		var myptsarray = this.pts_array;
		var myptscache = this.pts_cache;
		if (a !== 0)
		{
			sina = Math.sin(a);
			cosa = Math.cos(a);
		}
		for (i = 0, len = this.pts_count; i < len; i++)
		{
			i2 = i*2;
			i21 = i2+1;
			x = myptsarray[i2] * w;
			y = myptsarray[i21] * h;
			myptscache[i2] = (x * cosa) - (y * sina);
			myptscache[i21] = (y * cosa) + (x * sina);
		}
		this.update_bbox();
	};
	CollisionPoly_.prototype.contains_pt = function (a2x, a2y)
	{
		var myptscache = this.pts_cache;
		if (a2x === myptscache[0] && a2y === myptscache[1])
			return true;
		var i, i2, imod, len = this.pts_count;
		var a1x = this.bboxLeft - 110;
		var a1y = this.bboxTop - 101;
		var a3x = this.bboxRight + 131
		var a3y = this.bboxBottom + 120;
		var b1x, b1y, b2x, b2y;
		var count1 = 0, count2 = 0;
		for (i = 0; i < len; i++)
		{
			i2 = i*2;
			imod = ((i+1)%len)*2;
			b1x = myptscache[i2];
			b1y = myptscache[i2+1];
			b2x = myptscache[imod];
			b2y = myptscache[imod+1];
			if (cr.segments_intersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y))
				count1++;
			if (cr.segments_intersect(a3x, a3y, a2x, a2y, b1x, b1y, b2x, b2y))
				count2++;
		}
		return (count1 % 2 === 1) || (count2 % 2 === 1);
	};
	CollisionPoly_.prototype.intersects_poly = function (rhs, offx, offy)
	{
		var rhspts = rhs.pts_cache;
		var mypts = this.pts_cache;
		if (this.contains_pt(rhspts[0] + offx, rhspts[1] + offy))
			return true;
		if (rhs.contains_pt(mypts[0] - offx, mypts[1] - offy))
			return true;
		var i, i2, imod, leni, j, j2, jmod, lenj;
		var a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y;
		for (i = 0, leni = this.pts_count; i < leni; i++)
		{
			i2 = i*2;
			imod = ((i+1)%leni)*2;
			a1x = mypts[i2];
			a1y = mypts[i2+1];
			a2x = mypts[imod];
			a2y = mypts[imod+1];
			for (j = 0, lenj = rhs.pts_count; j < lenj; j++)
			{
				j2 = j*2;
				jmod = ((j+1)%lenj)*2;
				b1x = rhspts[j2] + offx;
				b1y = rhspts[j2+1] + offy;
				b2x = rhspts[jmod] + offx;
				b2y = rhspts[jmod+1] + offy;
				if (cr.segments_intersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y))
					return true;
			}
		}
		return false;
	};
	CollisionPoly_.prototype.intersects_segment = function (offx, offy, x1, y1, x2, y2)
	{
		var mypts = this.pts_cache;
		if (this.contains_pt(x1 - offx, y1 - offy))
			return true;
		var i, leni, i2, imod;
		var a1x, a1y, a2x, a2y;
		for (i = 0, leni = this.pts_count; i < leni; i++)
		{
			i2 = i*2;
			imod = ((i+1)%leni)*2;
			a1x = mypts[i2] + offx;
			a1y = mypts[i2+1] + offy;
			a2x = mypts[imod] + offx;
			a2y = mypts[imod+1] + offy;
			if (cr.segments_intersect(x1, y1, x2, y2, a1x, a1y, a2x, a2y))
				return true;
		}
		return false;
	};
	CollisionPoly_.prototype.mirror = function (px)
	{
		var i, leni, i2;
		for (i = 0, leni = this.pts_count; i < leni; ++i)
		{
			i2 = i*2;
			this.pts_cache[i2] = px * 2 - this.pts_cache[i2];
		}
	};
	CollisionPoly_.prototype.flip = function (py)
	{
		var i, leni, i21;
		for (i = 0, leni = this.pts_count; i < leni; ++i)
		{
			i21 = i*2+1;
			this.pts_cache[i21] = py * 2 - this.pts_cache[i21];
		}
	};
	CollisionPoly_.prototype.diag = function ()
	{
		var i, leni, i2, i21, temp;
		for (i = 0, leni = this.pts_count; i < leni; ++i)
		{
			i2 = i*2;
			i21 = i2+1;
			temp = this.pts_cache[i2];
			this.pts_cache[i2] = this.pts_cache[i21];
			this.pts_cache[i21] = temp;
		}
	};
	cr.CollisionPoly = CollisionPoly_;
	function SparseGrid_(cellwidth_, cellheight_)
	{
		this.cellwidth = cellwidth_;
		this.cellheight = cellheight_;
		this.cells = {};
	};
	SparseGrid_.prototype.totalCellCount = 0;
	SparseGrid_.prototype.getCell = function (x_, y_, create_if_missing)
	{
		var ret;
		var col = this.cells[x_];
		if (!col)
		{
			if (create_if_missing)
			{
				ret = allocGridCell(this, x_, y_);
				this.cells[x_] = {};
				this.cells[x_][y_] = ret;
				return ret;
			}
			else
				return null;
		}
		ret = col[y_];
		if (ret)
			return ret;
		else if (create_if_missing)
		{
			ret = allocGridCell(this, x_, y_);
			this.cells[x_][y_] = ret;
			return ret;
		}
		else
			return null;
	};
	SparseGrid_.prototype.XToCell = function (x_)
	{
		return cr.floor(x_ / this.cellwidth);
	};
	SparseGrid_.prototype.YToCell = function (y_)
	{
		return cr.floor(y_ / this.cellheight);
	};
	SparseGrid_.prototype.update = function (inst, oldrange, newrange)
	{
		var x, lenx, y, leny, cell;
		if (oldrange)
		{
			for (x = oldrange.left, lenx = oldrange.right; x <= lenx; ++x)
			{
				for (y = oldrange.top, leny = oldrange.bottom; y <= leny; ++y)
				{
					if (newrange && newrange.contains_pt(x, y))
						continue;	// is still in this cell
					cell = this.getCell(x, y, false);	// don't create if missing
					if (!cell)
						continue;	// cell does not exist yet
					cell.remove(inst);
					if (cell.isEmpty())
					{
						freeGridCell(cell);
						this.cells[x][y] = null;
					}
				}
			}
		}
		if (newrange)
		{
			for (x = newrange.left, lenx = newrange.right; x <= lenx; ++x)
			{
				for (y = newrange.top, leny = newrange.bottom; y <= leny; ++y)
				{
					if (oldrange && oldrange.contains_pt(x, y))
						continue;	// is still in this cell
					this.getCell(x, y, true).insert(inst);
				}
			}
		}
	};
	SparseGrid_.prototype.queryRange = function (rc, result)
	{
		var x, lenx, ystart, y, leny, cell;
		x = this.XToCell(rc.left);
		ystart = this.YToCell(rc.top);
		lenx = this.XToCell(rc.right);
		leny = this.YToCell(rc.bottom);
		for ( ; x <= lenx; ++x)
		{
			for (y = ystart; y <= leny; ++y)
			{
				cell = this.getCell(x, y, false);
				if (!cell)
					continue;
				cell.dump(result);
			}
		}
	};
	cr.SparseGrid = SparseGrid_;
	function RenderGrid_(cellwidth_, cellheight_)
	{
		this.cellwidth = cellwidth_;
		this.cellheight = cellheight_;
		this.cells = {};
	};
	RenderGrid_.prototype.totalCellCount = 0;
	RenderGrid_.prototype.getCell = function (x_, y_, create_if_missing)
	{
		var ret;
		var col = this.cells[x_];
		if (!col)
		{
			if (create_if_missing)
			{
				ret = allocRenderCell(this, x_, y_);
				this.cells[x_] = {};
				this.cells[x_][y_] = ret;
				return ret;
			}
			else
				return null;
		}
		ret = col[y_];
		if (ret)
			return ret;
		else if (create_if_missing)
		{
			ret = allocRenderCell(this, x_, y_);
			this.cells[x_][y_] = ret;
			return ret;
		}
		else
			return null;
	};
	RenderGrid_.prototype.XToCell = function (x_)
	{
		return cr.floor(x_ / this.cellwidth);
	};
	RenderGrid_.prototype.YToCell = function (y_)
	{
		return cr.floor(y_ / this.cellheight);
	};
	RenderGrid_.prototype.update = function (inst, oldrange, newrange)
	{
		var x, lenx, y, leny, cell;
		if (oldrange)
		{
			for (x = oldrange.left, lenx = oldrange.right; x <= lenx; ++x)
			{
				for (y = oldrange.top, leny = oldrange.bottom; y <= leny; ++y)
				{
					if (newrange && newrange.contains_pt(x, y))
						continue;	// is still in this cell
					cell = this.getCell(x, y, false);	// don't create if missing
					if (!cell)
						continue;	// cell does not exist yet
					cell.remove(inst);
					if (cell.isEmpty())
					{
						freeRenderCell(cell);
						this.cells[x][y] = null;
					}
				}
			}
		}
		if (newrange)
		{
			for (x = newrange.left, lenx = newrange.right; x <= lenx; ++x)
			{
				for (y = newrange.top, leny = newrange.bottom; y <= leny; ++y)
				{
					if (oldrange && oldrange.contains_pt(x, y))
						continue;	// is still in this cell
					this.getCell(x, y, true).insert(inst);
				}
			}
		}
	};
	RenderGrid_.prototype.queryRange = function (left, top, right, bottom, result)
	{
		var x, lenx, ystart, y, leny, cell;
		x = this.XToCell(left);
		ystart = this.YToCell(top);
		lenx = this.XToCell(right);
		leny = this.YToCell(bottom);
		for ( ; x <= lenx; ++x)
		{
			for (y = ystart; y <= leny; ++y)
			{
				cell = this.getCell(x, y, false);
				if (!cell)
					continue;
				cell.dump(result);
			}
		}
	};
	RenderGrid_.prototype.markRangeChanged = function (rc)
	{
		var x, lenx, ystart, y, leny, cell;
		x = rc.left;
		ystart = rc.top;
		lenx = rc.right;
		leny = rc.bottom;
		for ( ; x <= lenx; ++x)
		{
			for (y = ystart; y <= leny; ++y)
			{
				cell = this.getCell(x, y, false);
				if (!cell)
					continue;
				cell.is_sorted = false;
			}
		}
	};
	cr.RenderGrid = RenderGrid_;
	var gridcellcache = [];
	function allocGridCell(grid_, x_, y_)
	{
		var ret;
		SparseGrid_.prototype.totalCellCount++;
		if (gridcellcache.length)
		{
			ret = gridcellcache.pop();
			ret.grid = grid_;
			ret.x = x_;
			ret.y = y_;
			return ret;
		}
		else
			return new cr.GridCell(grid_, x_, y_);
	};
	function freeGridCell(c)
	{
		SparseGrid_.prototype.totalCellCount--;
		c.objects.clear();
		if (gridcellcache.length < 1000)
			gridcellcache.push(c);
	};
	function GridCell_(grid_, x_, y_)
	{
		this.grid = grid_;
		this.x = x_;
		this.y = y_;
		this.objects = new cr.ObjectSet();
	};
	GridCell_.prototype.isEmpty = function ()
	{
		return this.objects.isEmpty();
	};
	GridCell_.prototype.insert = function (inst)
	{
		this.objects.add(inst);
	};
	GridCell_.prototype.remove = function (inst)
	{
		this.objects.remove(inst);
	};
	GridCell_.prototype.dump = function (result)
	{
		cr.appendArray(result, this.objects.valuesRef());
	};
	cr.GridCell = GridCell_;
	var rendercellcache = [];
	function allocRenderCell(grid_, x_, y_)
	{
		var ret;
		RenderGrid_.prototype.totalCellCount++;
		if (rendercellcache.length)
		{
			ret = rendercellcache.pop();
			ret.grid = grid_;
			ret.x = x_;
			ret.y = y_;
			return ret;
		}
		else
			return new cr.RenderCell(grid_, x_, y_);
	};
	function freeRenderCell(c)
	{
		RenderGrid_.prototype.totalCellCount--;
		c.reset();
		if (rendercellcache.length < 1000)
			rendercellcache.push(c);
	};
	function RenderCell_(grid_, x_, y_)
	{
		this.grid = grid_;
		this.x = x_;
		this.y = y_;
		this.objects = [];		// array which needs to be sorted by Z order
		this.is_sorted = true;	// whether array is in correct sort order or not
		this.pending_removal = new cr.ObjectSet();
		this.any_pending_removal = false;
	};
	RenderCell_.prototype.isEmpty = function ()
	{
		if (!this.objects.length)
		{
;
;
			return true;
		}
		if (this.objects.length > this.pending_removal.count())
			return false;
;
		this.flush_pending();		// takes fast path and just resets state
		return true;
	};
	RenderCell_.prototype.insert = function (inst)
	{
		if (this.pending_removal.contains(inst))
		{
			this.pending_removal.remove(inst);
			if (this.pending_removal.isEmpty())
				this.any_pending_removal = false;
			return;
		}
		if (this.objects.length)
		{
			var top = this.objects[this.objects.length - 1];
			if (top.get_zindex() > inst.get_zindex())
				this.is_sorted = false;		// 'inst' should be somewhere beneath 'top'
			this.objects.push(inst);
		}
		else
		{
			this.objects.push(inst);
			this.is_sorted = true;
		}
;
	};
	RenderCell_.prototype.remove = function (inst)
	{
		this.pending_removal.add(inst);
		this.any_pending_removal = true;
		if (this.pending_removal.count() >= 30)
			this.flush_pending();
	};
	RenderCell_.prototype.flush_pending = function ()
	{
;
		if (!this.any_pending_removal)
			return;		// not changed
		if (this.pending_removal.count() === this.objects.length)
		{
			this.reset();
			return;
		}
		cr.arrayRemoveAllFromObjectSet(this.objects, this.pending_removal);
		this.pending_removal.clear();
		this.any_pending_removal = false;
	};
	function sortByInstanceZIndex(a, b)
	{
		return a.zindex - b.zindex;
	};
	RenderCell_.prototype.ensure_sorted = function ()
	{
		if (this.is_sorted)
			return;		// already sorted
		this.objects.sort(sortByInstanceZIndex);
		this.is_sorted = true;
	};
	RenderCell_.prototype.reset = function ()
	{
		cr.clearArray(this.objects);
		this.is_sorted = true;
		this.pending_removal.clear();
		this.any_pending_removal = false;
	};
	RenderCell_.prototype.dump = function (result)
	{
		this.flush_pending();
		this.ensure_sorted();
		if (this.objects.length)
			result.push(this.objects);
	};
	cr.RenderCell = RenderCell_;
	var fxNames = [ "lighter",
					"xor",
					"copy",
					"destination-over",
					"source-in",
					"destination-in",
					"source-out",
					"destination-out",
					"source-atop",
					"destination-atop"];
	cr.effectToCompositeOp = function(effect)
	{
		if (effect <= 0 || effect >= 11)
			return "source-over";
		return fxNames[effect - 1];	// not including "none" so offset by 1
	};
	cr.setGLBlend = function(this_, effect, gl)
	{
		if (!gl)
			return;
		this_.srcBlend = gl.ONE;
		this_.destBlend = gl.ONE_MINUS_SRC_ALPHA;
		switch (effect) {
		case 1:		// lighter (additive)
			this_.srcBlend = gl.ONE;
			this_.destBlend = gl.ONE;
			break;
		case 2:		// xor
			break;	// todo
		case 3:		// copy
			this_.srcBlend = gl.ONE;
			this_.destBlend = gl.ZERO;
			break;
		case 4:		// destination-over
			this_.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this_.destBlend = gl.ONE;
			break;
		case 5:		// source-in
			this_.srcBlend = gl.DST_ALPHA;
			this_.destBlend = gl.ZERO;
			break;
		case 6:		// destination-in
			this_.srcBlend = gl.ZERO;
			this_.destBlend = gl.SRC_ALPHA;
			break;
		case 7:		// source-out
			this_.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this_.destBlend = gl.ZERO;
			break;
		case 8:		// destination-out
			this_.srcBlend = gl.ZERO;
			this_.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 9:		// source-atop
			this_.srcBlend = gl.DST_ALPHA;
			this_.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 10:	// destination-atop
			this_.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this_.destBlend = gl.SRC_ALPHA;
			break;
		}
	};
	cr.round6dp = function (x)
	{
		return Math.round(x * 1000000) / 1000000;
	};
	/*
	var localeCompare_options = {
		"usage": "search",
		"sensitivity": "accent"
	};
	var has_localeCompare = !!"a".localeCompare;
	var localeCompare_works1 = (has_localeCompare && "a".localeCompare("A", undefined, localeCompare_options) === 0);
	var localeCompare_works2 = (has_localeCompare && "a".localeCompare("á", undefined, localeCompare_options) !== 0);
	var supports_localeCompare = (has_localeCompare && localeCompare_works1 && localeCompare_works2);
	*/
	cr.equals_nocase = function (a, b)
	{
		if (typeof a !== "string" || typeof b !== "string")
			return false;
		if (a.length !== b.length)
			return false;
		if (a === b)
			return true;
		/*
		if (supports_localeCompare)
		{
			return (a.localeCompare(b, undefined, localeCompare_options) === 0);
		}
		else
		{
		*/
			return a.toLowerCase() === b.toLowerCase();
	};
	cr.isCanvasInputEvent = function (e)
	{
		var target = e.target;
		if (!target)
			return true;
		if (target === document || target === window)
			return true;
		if (document && document.body && target === document.body)
			return true;
		if (cr.equals_nocase(target.tagName, "canvas"))
			return true;
		return false;
	};
}());
var MatrixArray=typeof Float32Array!=="undefined"?Float32Array:Array,glMatrixArrayType=MatrixArray,vec3={},mat3={},mat4={},quat4={};vec3.create=function(a){var b=new MatrixArray(3);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2]);return b};vec3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];return b};vec3.add=function(a,b,c){if(!c||a===c)return a[0]+=b[0],a[1]+=b[1],a[2]+=b[2],a;c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];return c};
vec3.subtract=function(a,b,c){if(!c||a===c)return a[0]-=b[0],a[1]-=b[1],a[2]-=b[2],a;c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];return c};vec3.negate=function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];return b};vec3.scale=function(a,b,c){if(!c||a===c)return a[0]*=b,a[1]*=b,a[2]*=b,a;c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;return c};
vec3.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=Math.sqrt(c*c+d*d+e*e);if(g){if(g===1)return b[0]=c,b[1]=d,b[2]=e,b}else return b[0]=0,b[1]=0,b[2]=0,b;g=1/g;b[0]=c*g;b[1]=d*g;b[2]=e*g;return b};vec3.cross=function(a,b,c){c||(c=a);var d=a[0],e=a[1],a=a[2],g=b[0],f=b[1],b=b[2];c[0]=e*b-a*f;c[1]=a*g-d*b;c[2]=d*f-e*g;return c};vec3.length=function(a){var b=a[0],c=a[1],a=a[2];return Math.sqrt(b*b+c*c+a*a)};vec3.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]};
vec3.direction=function(a,b,c){c||(c=a);var d=a[0]-b[0],e=a[1]-b[1],a=a[2]-b[2],b=Math.sqrt(d*d+e*e+a*a);if(!b)return c[0]=0,c[1]=0,c[2]=0,c;b=1/b;c[0]=d*b;c[1]=e*b;c[2]=a*b;return c};vec3.lerp=function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);d[2]=a[2]+c*(b[2]-a[2]);return d};vec3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+"]"};
mat3.create=function(a){var b=new MatrixArray(9);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8]);return b};mat3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];return b};mat3.identity=function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=1;a[5]=0;a[6]=0;a[7]=0;a[8]=1;return a};
mat3.transpose=function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[5];a[1]=a[3];a[2]=a[6];a[3]=c;a[5]=a[7];a[6]=d;a[7]=e;return a}b[0]=a[0];b[1]=a[3];b[2]=a[6];b[3]=a[1];b[4]=a[4];b[5]=a[7];b[6]=a[2];b[7]=a[5];b[8]=a[8];return b};mat3.toMat4=function(a,b){b||(b=mat4.create());b[15]=1;b[14]=0;b[13]=0;b[12]=0;b[11]=0;b[10]=a[8];b[9]=a[7];b[8]=a[6];b[7]=0;b[6]=a[5];b[5]=a[4];b[4]=a[3];b[3]=0;b[2]=a[2];b[1]=a[1];b[0]=a[0];return b};
mat3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+"]"};mat4.create=function(a){var b=new MatrixArray(16);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8],b[9]=a[9],b[10]=a[10],b[11]=a[11],b[12]=a[12],b[13]=a[13],b[14]=a[14],b[15]=a[15]);return b};
mat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15];return b};mat4.identity=function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=1;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=1;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a};
mat4.transpose=function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[3],g=a[6],f=a[7],h=a[11];a[1]=a[4];a[2]=a[8];a[3]=a[12];a[4]=c;a[6]=a[9];a[7]=a[13];a[8]=d;a[9]=g;a[11]=a[14];a[12]=e;a[13]=f;a[14]=h;return a}b[0]=a[0];b[1]=a[4];b[2]=a[8];b[3]=a[12];b[4]=a[1];b[5]=a[5];b[6]=a[9];b[7]=a[13];b[8]=a[2];b[9]=a[6];b[10]=a[10];b[11]=a[14];b[12]=a[3];b[13]=a[7];b[14]=a[11];b[15]=a[15];return b};
mat4.determinant=function(a){var b=a[0],c=a[1],d=a[2],e=a[3],g=a[4],f=a[5],h=a[6],i=a[7],j=a[8],k=a[9],l=a[10],n=a[11],o=a[12],m=a[13],p=a[14],a=a[15];return o*k*h*e-j*m*h*e-o*f*l*e+g*m*l*e+j*f*p*e-g*k*p*e-o*k*d*i+j*m*d*i+o*c*l*i-b*m*l*i-j*c*p*i+b*k*p*i+o*f*d*n-g*m*d*n-o*c*h*n+b*m*h*n+g*c*p*n-b*f*p*n-j*f*d*a+g*k*d*a+j*c*h*a-b*k*h*a-g*c*l*a+b*f*l*a};
mat4.inverse=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=a[4],h=a[5],i=a[6],j=a[7],k=a[8],l=a[9],n=a[10],o=a[11],m=a[12],p=a[13],r=a[14],s=a[15],A=c*h-d*f,B=c*i-e*f,t=c*j-g*f,u=d*i-e*h,v=d*j-g*h,w=e*j-g*i,x=k*p-l*m,y=k*r-n*m,z=k*s-o*m,C=l*r-n*p,D=l*s-o*p,E=n*s-o*r,q=1/(A*E-B*D+t*C+u*z-v*y+w*x);b[0]=(h*E-i*D+j*C)*q;b[1]=(-d*E+e*D-g*C)*q;b[2]=(p*w-r*v+s*u)*q;b[3]=(-l*w+n*v-o*u)*q;b[4]=(-f*E+i*z-j*y)*q;b[5]=(c*E-e*z+g*y)*q;b[6]=(-m*w+r*t-s*B)*q;b[7]=(k*w-n*t+o*B)*q;b[8]=(f*D-h*z+j*x)*q;
b[9]=(-c*D+d*z-g*x)*q;b[10]=(m*v-p*t+s*A)*q;b[11]=(-k*v+l*t-o*A)*q;b[12]=(-f*C+h*y-i*x)*q;b[13]=(c*C-d*y+e*x)*q;b[14]=(-m*u+p*B-r*A)*q;b[15]=(k*u-l*B+n*A)*q;return b};mat4.toRotationMat=function(a,b){b||(b=mat4.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
mat4.toMat3=function(a,b){b||(b=mat3.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[4];b[4]=a[5];b[5]=a[6];b[6]=a[8];b[7]=a[9];b[8]=a[10];return b};mat4.toInverseMat3=function(a,b){var c=a[0],d=a[1],e=a[2],g=a[4],f=a[5],h=a[6],i=a[8],j=a[9],k=a[10],l=k*f-h*j,n=-k*g+h*i,o=j*g-f*i,m=c*l+d*n+e*o;if(!m)return null;m=1/m;b||(b=mat3.create());b[0]=l*m;b[1]=(-k*d+e*j)*m;b[2]=(h*d-e*f)*m;b[3]=n*m;b[4]=(k*c-e*i)*m;b[5]=(-h*c+e*g)*m;b[6]=o*m;b[7]=(-j*c+d*i)*m;b[8]=(f*c-d*g)*m;return b};
mat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],f=a[3],h=a[4],i=a[5],j=a[6],k=a[7],l=a[8],n=a[9],o=a[10],m=a[11],p=a[12],r=a[13],s=a[14],a=a[15],A=b[0],B=b[1],t=b[2],u=b[3],v=b[4],w=b[5],x=b[6],y=b[7],z=b[8],C=b[9],D=b[10],E=b[11],q=b[12],F=b[13],G=b[14],b=b[15];c[0]=A*d+B*h+t*l+u*p;c[1]=A*e+B*i+t*n+u*r;c[2]=A*g+B*j+t*o+u*s;c[3]=A*f+B*k+t*m+u*a;c[4]=v*d+w*h+x*l+y*p;c[5]=v*e+w*i+x*n+y*r;c[6]=v*g+w*j+x*o+y*s;c[7]=v*f+w*k+x*m+y*a;c[8]=z*d+C*h+D*l+E*p;c[9]=z*e+C*i+D*n+E*r;c[10]=z*g+C*
j+D*o+E*s;c[11]=z*f+C*k+D*m+E*a;c[12]=q*d+F*h+G*l+b*p;c[13]=q*e+F*i+G*n+b*r;c[14]=q*g+F*j+G*o+b*s;c[15]=q*f+F*k+G*m+b*a;return c};mat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],b=b[2];c[0]=a[0]*d+a[4]*e+a[8]*b+a[12];c[1]=a[1]*d+a[5]*e+a[9]*b+a[13];c[2]=a[2]*d+a[6]*e+a[10]*b+a[14];return c};
mat4.multiplyVec4=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2],b=b[3];c[0]=a[0]*d+a[4]*e+a[8]*g+a[12]*b;c[1]=a[1]*d+a[5]*e+a[9]*g+a[13]*b;c[2]=a[2]*d+a[6]*e+a[10]*g+a[14]*b;c[3]=a[3]*d+a[7]*e+a[11]*g+a[15]*b;return c};
mat4.translate=function(a,b,c){var d=b[0],e=b[1],b=b[2],g,f,h,i,j,k,l,n,o,m,p,r;if(!c||a===c)return a[12]=a[0]*d+a[4]*e+a[8]*b+a[12],a[13]=a[1]*d+a[5]*e+a[9]*b+a[13],a[14]=a[2]*d+a[6]*e+a[10]*b+a[14],a[15]=a[3]*d+a[7]*e+a[11]*b+a[15],a;g=a[0];f=a[1];h=a[2];i=a[3];j=a[4];k=a[5];l=a[6];n=a[7];o=a[8];m=a[9];p=a[10];r=a[11];c[0]=g;c[1]=f;c[2]=h;c[3]=i;c[4]=j;c[5]=k;c[6]=l;c[7]=n;c[8]=o;c[9]=m;c[10]=p;c[11]=r;c[12]=g*d+j*e+o*b+a[12];c[13]=f*d+k*e+m*b+a[13];c[14]=h*d+l*e+p*b+a[14];c[15]=i*d+n*e+r*b+a[15];
return c};mat4.scale=function(a,b,c){var d=b[0],e=b[1],b=b[2];if(!c||a===c)return a[0]*=d,a[1]*=d,a[2]*=d,a[3]*=d,a[4]*=e,a[5]*=e,a[6]*=e,a[7]*=e,a[8]*=b,a[9]*=b,a[10]*=b,a[11]*=b,a;c[0]=a[0]*d;c[1]=a[1]*d;c[2]=a[2]*d;c[3]=a[3]*d;c[4]=a[4]*e;c[5]=a[5]*e;c[6]=a[6]*e;c[7]=a[7]*e;c[8]=a[8]*b;c[9]=a[9]*b;c[10]=a[10]*b;c[11]=a[11]*b;c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15];return c};
mat4.rotate=function(a,b,c,d){var e=c[0],g=c[1],c=c[2],f=Math.sqrt(e*e+g*g+c*c),h,i,j,k,l,n,o,m,p,r,s,A,B,t,u,v,w,x,y,z;if(!f)return null;f!==1&&(f=1/f,e*=f,g*=f,c*=f);h=Math.sin(b);i=Math.cos(b);j=1-i;b=a[0];f=a[1];k=a[2];l=a[3];n=a[4];o=a[5];m=a[6];p=a[7];r=a[8];s=a[9];A=a[10];B=a[11];t=e*e*j+i;u=g*e*j+c*h;v=c*e*j-g*h;w=e*g*j-c*h;x=g*g*j+i;y=c*g*j+e*h;z=e*c*j+g*h;e=g*c*j-e*h;g=c*c*j+i;d?a!==d&&(d[12]=a[12],d[13]=a[13],d[14]=a[14],d[15]=a[15]):d=a;d[0]=b*t+n*u+r*v;d[1]=f*t+o*u+s*v;d[2]=k*t+m*u+A*
v;d[3]=l*t+p*u+B*v;d[4]=b*w+n*x+r*y;d[5]=f*w+o*x+s*y;d[6]=k*w+m*x+A*y;d[7]=l*w+p*x+B*y;d[8]=b*z+n*e+r*g;d[9]=f*z+o*e+s*g;d[10]=k*z+m*e+A*g;d[11]=l*z+p*e+B*g;return d};mat4.rotateX=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[4],g=a[5],f=a[6],h=a[7],i=a[8],j=a[9],k=a[10],l=a[11];c?a!==c&&(c[0]=a[0],c[1]=a[1],c[2]=a[2],c[3]=a[3],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[4]=e*b+i*d;c[5]=g*b+j*d;c[6]=f*b+k*d;c[7]=h*b+l*d;c[8]=e*-d+i*b;c[9]=g*-d+j*b;c[10]=f*-d+k*b;c[11]=h*-d+l*b;return c};
mat4.rotateY=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],g=a[1],f=a[2],h=a[3],i=a[8],j=a[9],k=a[10],l=a[11];c?a!==c&&(c[4]=a[4],c[5]=a[5],c[6]=a[6],c[7]=a[7],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[0]=e*b+i*-d;c[1]=g*b+j*-d;c[2]=f*b+k*-d;c[3]=h*b+l*-d;c[8]=e*d+i*b;c[9]=g*d+j*b;c[10]=f*d+k*b;c[11]=h*d+l*b;return c};
mat4.rotateZ=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],g=a[1],f=a[2],h=a[3],i=a[4],j=a[5],k=a[6],l=a[7];c?a!==c&&(c[8]=a[8],c[9]=a[9],c[10]=a[10],c[11]=a[11],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[0]=e*b+i*d;c[1]=g*b+j*d;c[2]=f*b+k*d;c[3]=h*b+l*d;c[4]=e*-d+i*b;c[5]=g*-d+j*b;c[6]=f*-d+k*b;c[7]=h*-d+l*b;return c};
mat4.frustum=function(a,b,c,d,e,g,f){f||(f=mat4.create());var h=b-a,i=d-c,j=g-e;f[0]=e*2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=e*2/i;f[6]=0;f[7]=0;f[8]=(b+a)/h;f[9]=(d+c)/i;f[10]=-(g+e)/j;f[11]=-1;f[12]=0;f[13]=0;f[14]=-(g*e*2)/j;f[15]=0;return f};mat4.perspective=function(a,b,c,d,e){a=c*Math.tan(a*Math.PI/360);b*=a;return mat4.frustum(-b,b,-a,a,c,d,e)};
mat4.ortho=function(a,b,c,d,e,g,f){f||(f=mat4.create());var h=b-a,i=d-c,j=g-e;f[0]=2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=2/i;f[6]=0;f[7]=0;f[8]=0;f[9]=0;f[10]=-2/j;f[11]=0;f[12]=-(a+b)/h;f[13]=-(d+c)/i;f[14]=-(g+e)/j;f[15]=1;return f};
mat4.lookAt=function(a,b,c,d){d||(d=mat4.create());var e,g,f,h,i,j,k,l,n=a[0],o=a[1],a=a[2];g=c[0];f=c[1];e=c[2];c=b[1];j=b[2];if(n===b[0]&&o===c&&a===j)return mat4.identity(d);c=n-b[0];j=o-b[1];k=a-b[2];l=1/Math.sqrt(c*c+j*j+k*k);c*=l;j*=l;k*=l;b=f*k-e*j;e=e*c-g*k;g=g*j-f*c;(l=Math.sqrt(b*b+e*e+g*g))?(l=1/l,b*=l,e*=l,g*=l):g=e=b=0;f=j*g-k*e;h=k*b-c*g;i=c*e-j*b;(l=Math.sqrt(f*f+h*h+i*i))?(l=1/l,f*=l,h*=l,i*=l):i=h=f=0;d[0]=b;d[1]=f;d[2]=c;d[3]=0;d[4]=e;d[5]=h;d[6]=j;d[7]=0;d[8]=g;d[9]=i;d[10]=k;d[11]=
0;d[12]=-(b*n+e*o+g*a);d[13]=-(f*n+h*o+i*a);d[14]=-(c*n+j*o+k*a);d[15]=1;return d};mat4.fromRotationTranslation=function(a,b,c){c||(c=mat4.create());var d=a[0],e=a[1],g=a[2],f=a[3],h=d+d,i=e+e,j=g+g,a=d*h,k=d*i;d*=j;var l=e*i;e*=j;g*=j;h*=f;i*=f;f*=j;c[0]=1-(l+g);c[1]=k+f;c[2]=d-i;c[3]=0;c[4]=k-f;c[5]=1-(a+g);c[6]=e+h;c[7]=0;c[8]=d+i;c[9]=e-h;c[10]=1-(a+l);c[11]=0;c[12]=b[0];c[13]=b[1];c[14]=b[2];c[15]=1;return c};
mat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+a[15]+"]"};quat4.create=function(a){var b=new MatrixArray(4);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3]);return b};quat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b};
quat4.calculateW=function(a,b){var c=a[0],d=a[1],e=a[2];if(!b||a===b)return a[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e)),a;b[0]=c;b[1]=d;b[2]=e;b[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e));return b};quat4.inverse=function(a,b){if(!b||a===b)return a[0]*=-1,a[1]*=-1,a[2]*=-1,a;b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];b[3]=a[3];return b};quat4.length=function(a){var b=a[0],c=a[1],d=a[2],a=a[3];return Math.sqrt(b*b+c*c+d*d+a*a)};
quat4.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=Math.sqrt(c*c+d*d+e*e+g*g);if(f===0)return b[0]=0,b[1]=0,b[2]=0,b[3]=0,b;f=1/f;b[0]=c*f;b[1]=d*f;b[2]=e*f;b[3]=g*f;return b};quat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],a=a[3],f=b[0],h=b[1],i=b[2],b=b[3];c[0]=d*b+a*f+e*i-g*h;c[1]=e*b+a*h+g*f-d*i;c[2]=g*b+a*i+d*h-e*f;c[3]=a*b-d*f-e*h-g*i;return c};
quat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2],b=a[0],f=a[1],h=a[2],a=a[3],i=a*d+f*g-h*e,j=a*e+h*d-b*g,k=a*g+b*e-f*d,d=-b*d-f*e-h*g;c[0]=i*a+d*-b+j*-h-k*-f;c[1]=j*a+d*-f+k*-b-i*-h;c[2]=k*a+d*-h+i*-f-j*-b;return c};quat4.toMat3=function(a,b){b||(b=mat3.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,i=e+e,j=c*f,k=c*h;c*=i;var l=d*h;d*=i;e*=i;f*=g;h*=g;g*=i;b[0]=1-(l+e);b[1]=k+g;b[2]=c-h;b[3]=k-g;b[4]=1-(j+e);b[5]=d+f;b[6]=c+h;b[7]=d-f;b[8]=1-(j+l);return b};
quat4.toMat4=function(a,b){b||(b=mat4.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,i=e+e,j=c*f,k=c*h;c*=i;var l=d*h;d*=i;e*=i;f*=g;h*=g;g*=i;b[0]=1-(l+e);b[1]=k+g;b[2]=c-h;b[3]=0;b[4]=k-g;b[5]=1-(j+e);b[6]=d+f;b[7]=0;b[8]=c+h;b[9]=d-f;b[10]=1-(j+l);b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
quat4.slerp=function(a,b,c,d){d||(d=a);var e=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3],g,f;if(Math.abs(e)>=1)return d!==a&&(d[0]=a[0],d[1]=a[1],d[2]=a[2],d[3]=a[3]),d;g=Math.acos(e);f=Math.sqrt(1-e*e);if(Math.abs(f)<0.001)return d[0]=a[0]*0.5+b[0]*0.5,d[1]=a[1]*0.5+b[1]*0.5,d[2]=a[2]*0.5+b[2]*0.5,d[3]=a[3]*0.5+b[3]*0.5,d;e=Math.sin((1-c)*g)/f;c=Math.sin(c*g)/f;d[0]=a[0]*e+b[0]*c;d[1]=a[1]*e+b[1]*c;d[2]=a[2]*e+b[2]*c;d[3]=a[3]*e+b[3]*c;return d};
quat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"};
(function()
{
	var MAX_VERTICES = 8000;						// equates to 2500 objects being drawn
	var MAX_INDICES = (MAX_VERTICES / 2) * 3;		// 6 indices for every 4 vertices
	var MAX_POINTS = 8000;
	var MULTI_BUFFERS = 4;							// cycle 4 buffers to try and avoid blocking
	var BATCH_NULL = 0;
	var BATCH_QUAD = 1;
	var BATCH_SETTEXTURE = 2;
	var BATCH_SETOPACITY = 3;
	var BATCH_SETBLEND = 4;
	var BATCH_UPDATEMODELVIEW = 5;
	var BATCH_RENDERTOTEXTURE = 6;
	var BATCH_CLEAR = 7;
	var BATCH_POINTS = 8;
	var BATCH_SETPROGRAM = 9;
	var BATCH_SETPROGRAMPARAMETERS = 10;
	var BATCH_SETTEXTURE1 = 11;
	var BATCH_SETCOLOR = 12;
	var BATCH_SETDEPTHTEST = 13;
	var BATCH_SETEARLYZMODE = 14;
	/*
	var lose_ext = null;
	window.lose_context = function ()
	{
		if (!lose_ext)
		{
			console.log("WEBGL_lose_context not supported");
			return;
		}
		lose_ext.loseContext();
	};
	window.restore_context = function ()
	{
		if (!lose_ext)
		{
			console.log("WEBGL_lose_context not supported");
			return;
		}
		lose_ext.restoreContext();
	};
	*/
	var tempMat4 = mat4.create();
	function GLWrap_(gl, isMobile, enableFrontToBack)
	{
		this.isIE = /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
		this.width = 0;		// not yet known, wait for call to setSize()
		this.height = 0;
		this.enableFrontToBack = !!enableFrontToBack;
		this.isEarlyZPass = false;
		this.isBatchInEarlyZPass = false;
		this.currentZ = 0;
		this.zNear = 1;
		this.zFar = 1000;
		this.zIncrement = ((this.zFar - this.zNear) / 32768);
		this.zA = this.zFar / (this.zFar - this.zNear);
		this.zB = this.zFar * this.zNear / (this.zNear - this.zFar);
		this.kzA = 65536 * this.zA;
		this.kzB = 65536 * this.zB;
		this.cam = vec3.create([0, 0, 100]);			// camera position
		this.look = vec3.create([0, 0, 0]);				// lookat position
		this.up = vec3.create([0, 1, 0]);				// up vector
		this.worldScale = vec3.create([1, 1, 1]);		// world scaling factor
		this.enable_mipmaps = true;
		this.matP = mat4.create();						// perspective matrix
		this.matMV = mat4.create();						// model view matrix
		this.lastMV = mat4.create();
		this.currentMV = mat4.create();
		this.gl = gl;
		this.version = (this.gl.getParameter(this.gl.VERSION).indexOf("WebGL 2") === 0 ? 2 : 1);
		this.initState();
	};
	GLWrap_.prototype.initState = function ()
	{
		var gl = this.gl;
		var i, len;
		this.lastOpacity = 1;
		this.lastTexture0 = null;			// last bound to TEXTURE0
		this.lastTexture1 = null;			// last bound to TEXTURE1
		this.currentOpacity = 1;
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.disable(gl.CULL_FACE);
		gl.disable(gl.STENCIL_TEST);
		gl.disable(gl.DITHER);
		if (this.enableFrontToBack)
		{
			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);
		}
		else
		{
			gl.disable(gl.DEPTH_TEST);
		}
		this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
		this.lastSrcBlend = gl.ONE;
		this.lastDestBlend = gl.ONE_MINUS_SRC_ALPHA;
		this.vertexData = new Float32Array(MAX_VERTICES * (this.enableFrontToBack ? 3 : 2));
		this.texcoordData = new Float32Array(MAX_VERTICES * 2);
		this.pointData = new Float32Array(MAX_POINTS * 4);
		this.pointBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.pointData.byteLength, gl.DYNAMIC_DRAW);
		this.vertexBuffers = new Array(MULTI_BUFFERS);
		this.texcoordBuffers = new Array(MULTI_BUFFERS);
		for (i = 0; i < MULTI_BUFFERS; i++)
		{
			this.vertexBuffers[i] = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers[i]);
			gl.bufferData(gl.ARRAY_BUFFER, this.vertexData.byteLength, gl.DYNAMIC_DRAW);
			this.texcoordBuffers[i] = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffers[i]);
			gl.bufferData(gl.ARRAY_BUFFER, this.texcoordData.byteLength, gl.DYNAMIC_DRAW);
		}
		this.curBuffer = 0;
		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		var indexData = new Uint16Array(MAX_INDICES);
		i = 0, len = MAX_INDICES;
		var fv = 0;
		while (i < len)
		{
			indexData[i++] = fv;		// top left
			indexData[i++] = fv + 1;	// top right
			indexData[i++] = fv + 2;	// bottom right (first tri)
			indexData[i++] = fv;		// top left
			indexData[i++] = fv + 2;	// bottom right
			indexData[i++] = fv + 3;	// bottom left
			fv += 4;
		}
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
		this.vertexPtr = 0;
		this.texPtr = 0;
		this.pointPtr = 0;
		var fsSource, vsSource;
		this.shaderPrograms = [];
		fsSource = [
			"varying mediump vec2 vTex;",
			"uniform lowp float opacity;",
			"uniform lowp sampler2D samplerFront;",
			"void main(void) {",
			"	gl_FragColor = texture2D(samplerFront, vTex);",
			"	gl_FragColor *= opacity;",
			"}"
		].join("\n");
		if (this.enableFrontToBack)
		{
			vsSource = [
				"attribute highp vec3 aPos;",
				"attribute mediump vec2 aTex;",
				"varying mediump vec2 vTex;",
				"uniform highp mat4 matP;",
				"uniform highp mat4 matMV;",
				"void main(void) {",
				"	gl_Position = matP * matMV * vec4(aPos.x, aPos.y, aPos.z, 1.0);",
				"	vTex = aTex;",
				"}"
			].join("\n");
		}
		else
		{
			vsSource = [
				"attribute highp vec2 aPos;",
				"attribute mediump vec2 aTex;",
				"varying mediump vec2 vTex;",
				"uniform highp mat4 matP;",
				"uniform highp mat4 matMV;",
				"void main(void) {",
				"	gl_Position = matP * matMV * vec4(aPos.x, aPos.y, 0.0, 1.0);",
				"	vTex = aTex;",
				"}"
			].join("\n");
		}
		var shaderProg = this.createShaderProgram({src: fsSource}, vsSource, "<default>");
;
		this.shaderPrograms.push(shaderProg);		// Default shader is always shader 0
		fsSource = [
			"uniform mediump sampler2D samplerFront;",
			"varying lowp float opacity;",
			"void main(void) {",
			"	gl_FragColor = texture2D(samplerFront, gl_PointCoord);",
			"	gl_FragColor *= opacity;",
			"}"
		].join("\n");
		var pointVsSource = [
			"attribute vec4 aPos;",
			"varying float opacity;",
			"uniform mat4 matP;",
			"uniform mat4 matMV;",
			"void main(void) {",
			"	gl_Position = matP * matMV * vec4(aPos.x, aPos.y, 0.0, 1.0);",
			"	gl_PointSize = aPos.z;",
			"	opacity = aPos.w;",
			"}"
		].join("\n");
		shaderProg = this.createShaderProgram({src: fsSource}, pointVsSource, "<point>");
;
		this.shaderPrograms.push(shaderProg);		// Point shader is always shader 1
		fsSource = [
			"varying mediump vec2 vTex;",
			"uniform lowp sampler2D samplerFront;",
			"void main(void) {",
			"	if (texture2D(samplerFront, vTex).a < 1.0)",
			"		discard;",						// discarding non-opaque fragments
			"}"
		].join("\n");
		var shaderProg = this.createShaderProgram({src: fsSource}, vsSource, "<earlyz>");
;
		this.shaderPrograms.push(shaderProg);		// Early-Z shader is always shader 2
		fsSource = [
			"uniform lowp vec4 colorFill;",
			"void main(void) {",
			"	gl_FragColor = colorFill;",
			"}"
		].join("\n");
		var shaderProg = this.createShaderProgram({src: fsSource}, vsSource, "<fill>");
;
		this.shaderPrograms.push(shaderProg);		// Fill-color shader is always shader 3
		for (var shader_name in cr.shaders)
		{
			if (cr.shaders.hasOwnProperty(shader_name))
				this.shaderPrograms.push(this.createShaderProgram(cr.shaders[shader_name], vsSource, shader_name));
		}
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.batch = [];
		this.batchPtr = 0;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
		this.lastProgram = -1;				// start -1 so first switchProgram can do work
		this.currentProgram = -1;			// current program during batch execution
		this.currentShader = null;
		this.fbo = gl.createFramebuffer();
		this.renderToTex = null;
		this.depthBuffer = null;
		this.attachedDepthBuffer = false;	// wait until first size call to attach, otherwise it has no storage
		if (this.enableFrontToBack)
		{
			this.depthBuffer = gl.createRenderbuffer();
		}
		this.tmpVec3 = vec3.create([0, 0, 0]);
;
		var pointsizes = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
		this.minPointSize = pointsizes[0];
		this.maxPointSize = pointsizes[1];
		if (this.maxPointSize > 2048)
			this.maxPointSize = 2048;
;
		this.switchProgram(0);
		cr.seal(this);
	};
	function GLShaderProgram(gl, shaderProgram, name)
	{
		this.gl = gl;
		this.shaderProgram = shaderProgram;
		this.name = name;
		this.locAPos = gl.getAttribLocation(shaderProgram, "aPos");
		this.locATex = gl.getAttribLocation(shaderProgram, "aTex");
		this.locMatP = gl.getUniformLocation(shaderProgram, "matP");
		this.locMatMV = gl.getUniformLocation(shaderProgram, "matMV");
		this.locOpacity = gl.getUniformLocation(shaderProgram, "opacity");
		this.locColorFill = gl.getUniformLocation(shaderProgram, "colorFill");
		this.locSamplerFront = gl.getUniformLocation(shaderProgram, "samplerFront");
		this.locSamplerBack = gl.getUniformLocation(shaderProgram, "samplerBack");
		this.locDestStart = gl.getUniformLocation(shaderProgram, "destStart");
		this.locDestEnd = gl.getUniformLocation(shaderProgram, "destEnd");
		this.locSeconds = gl.getUniformLocation(shaderProgram, "seconds");
		this.locPixelWidth = gl.getUniformLocation(shaderProgram, "pixelWidth");
		this.locPixelHeight = gl.getUniformLocation(shaderProgram, "pixelHeight");
		this.locLayerScale = gl.getUniformLocation(shaderProgram, "layerScale");
		this.locLayerAngle = gl.getUniformLocation(shaderProgram, "layerAngle");
		this.locViewOrigin = gl.getUniformLocation(shaderProgram, "viewOrigin");
		this.locScrollPos = gl.getUniformLocation(shaderProgram, "scrollPos");
		this.hasAnyOptionalUniforms = !!(this.locPixelWidth || this.locPixelHeight || this.locSeconds || this.locSamplerBack || this.locDestStart || this.locDestEnd || this.locLayerScale || this.locLayerAngle || this.locViewOrigin || this.locScrollPos);
		this.lpPixelWidth = -999;		// set to something unlikely so never counts as cached on first set
		this.lpPixelHeight = -999;
		this.lpOpacity = 1;
		this.lpDestStartX = 0.0;
		this.lpDestStartY = 0.0;
		this.lpDestEndX = 1.0;
		this.lpDestEndY = 1.0;
		this.lpLayerScale = 1.0;
		this.lpLayerAngle = 0.0;
		this.lpViewOriginX = 0.0;
		this.lpViewOriginY = 0.0;
		this.lpScrollPosX = 0.0;
		this.lpScrollPosY = 0.0;
		this.lpSeconds = 0.0;
		this.lastCustomParams = [];
		this.lpMatMV = mat4.create();
		if (this.locOpacity)
			gl.uniform1f(this.locOpacity, 1);
		if (this.locColorFill)
			gl.uniform4f(this.locColorFill, 1.0, 1.0, 1.0, 1.0);
		if (this.locSamplerFront)
			gl.uniform1i(this.locSamplerFront, 0);
		if (this.locSamplerBack)
			gl.uniform1i(this.locSamplerBack, 1);
		if (this.locDestStart)
			gl.uniform2f(this.locDestStart, 0.0, 0.0);
		if (this.locDestEnd)
			gl.uniform2f(this.locDestEnd, 1.0, 1.0);
		if (this.locLayerScale)
			gl.uniform1f(this.locLayerScale, 1.0);
		if (this.locLayerAngle)
			gl.uniform1f(this.locLayerAngle, 0.0);
		if (this.locViewOrigin)
			gl.uniform2f(this.locViewOrigin, 0.0, 0.0);
		if (this.locScrollPos)
			gl.uniform2f(this.locScrollPos, 0.0, 0.0);
		if (this.locSeconds)
			gl.uniform1f(this.locSeconds, 0.0);
		this.hasCurrentMatMV = false;		// matMV needs updating
	};
	function areMat4sEqual(a, b)
	{
		return a[0]===b[0]&&a[1]===b[1]&&a[2]===b[2]&&a[3]===b[3]&&
			   a[4]===b[4]&&a[5]===b[5]&&a[6]===b[6]&&a[7]===b[7]&&
			   a[8]===b[8]&&a[9]===b[9]&&a[10]===b[10]&&a[11]===b[11]&&
			   a[12]===b[12]&&a[13]===b[13]&&a[14]===b[14]&&a[15]===b[15];
	};
	GLShaderProgram.prototype.updateMatMV = function (mv)
	{
		if (areMat4sEqual(this.lpMatMV, mv))
			return;		// no change, save the expensive GL call
		mat4.set(mv, this.lpMatMV);
		this.gl.uniformMatrix4fv(this.locMatMV, false, mv);
	};
	GLWrap_.prototype.createShaderProgram = function(shaderEntry, vsSource, name)
	{
		var gl = this.gl;
		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, shaderEntry.src);
		gl.compileShader(fragmentShader);
		if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
		{
			var compilationlog = gl.getShaderInfoLog(fragmentShader);
			gl.deleteShader(fragmentShader);
			throw new Error("error compiling fragment shader: " + compilationlog);
		}
		var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, vsSource);
		gl.compileShader(vertexShader);
		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
		{
			var compilationlog = gl.getShaderInfoLog(vertexShader);
			gl.deleteShader(fragmentShader);
			gl.deleteShader(vertexShader);
			throw new Error("error compiling vertex shader: " + compilationlog);
		}
		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, fragmentShader);
		gl.attachShader(shaderProgram, vertexShader);
		gl.linkProgram(shaderProgram);
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
		{
			var compilationlog = gl.getProgramInfoLog(shaderProgram);
			gl.deleteShader(fragmentShader);
			gl.deleteShader(vertexShader);
			gl.deleteProgram(shaderProgram);
			throw new Error("error linking shader program: " + compilationlog);
		}
		gl.useProgram(shaderProgram);
		gl.deleteShader(fragmentShader);
		gl.deleteShader(vertexShader);
		var ret = new GLShaderProgram(gl, shaderProgram, name);
		ret.extendBoxHorizontal = shaderEntry.extendBoxHorizontal || 0;
		ret.extendBoxVertical = shaderEntry.extendBoxVertical || 0;
		ret.crossSampling = !!shaderEntry.crossSampling;
		ret.preservesOpaqueness = !!shaderEntry.preservesOpaqueness;
		ret.animated = !!shaderEntry.animated;
		ret.parameters = shaderEntry.parameters || [];
		var i, len;
		for (i = 0, len = ret.parameters.length; i < len; i++)
		{
			ret.parameters[i][1] = gl.getUniformLocation(shaderProgram, ret.parameters[i][0]);
			ret.lastCustomParams.push(0);
			gl.uniform1f(ret.parameters[i][1], 0);
		}
		cr.seal(ret);
		return ret;
	};
	GLWrap_.prototype.getShaderIndex = function(name_)
	{
		var i, len;
		for (i = 0, len = this.shaderPrograms.length; i < len; i++)
		{
			if (this.shaderPrograms[i].name === name_)
				return i;
		}
		return -1;
	};
	GLWrap_.prototype.project = function (x, y, out)
	{
		var mv = this.matMV;
		var proj = this.matP;
		var fTempo = [0, 0, 0, 0, 0, 0, 0, 0];
		fTempo[0] = mv[0]*x+mv[4]*y+mv[12];
		fTempo[1] = mv[1]*x+mv[5]*y+mv[13];
		fTempo[2] = mv[2]*x+mv[6]*y+mv[14];
		fTempo[3] = mv[3]*x+mv[7]*y+mv[15];
		fTempo[4] = proj[0]*fTempo[0]+proj[4]*fTempo[1]+proj[8]*fTempo[2]+proj[12]*fTempo[3];
		fTempo[5] = proj[1]*fTempo[0]+proj[5]*fTempo[1]+proj[9]*fTempo[2]+proj[13]*fTempo[3];
		fTempo[6] = proj[2]*fTempo[0]+proj[6]*fTempo[1]+proj[10]*fTempo[2]+proj[14]*fTempo[3];
		fTempo[7] = -fTempo[2];
		if(fTempo[7]===0.0)	//The w value
			return;
		fTempo[7]=1.0/fTempo[7];
		fTempo[4]*=fTempo[7];
		fTempo[5]*=fTempo[7];
		fTempo[6]*=fTempo[7];
		out[0]=(fTempo[4]*0.5+0.5)*this.width;
		out[1]=(fTempo[5]*0.5+0.5)*this.height;
	};
	GLWrap_.prototype.setSize = function(w, h, force)
	{
		if (this.width === w && this.height === h && !force)
			return;
		this.endBatch();
		var gl = this.gl;
		this.width = w;
		this.height = h;
		gl.viewport(0, 0, w, h);
		mat4.lookAt(this.cam, this.look, this.up, this.matMV);
		if (this.enableFrontToBack)
		{
			mat4.ortho(-w/2, w/2, h/2, -h/2, this.zNear, this.zFar, this.matP);
			this.worldScale[0] = 1;
			this.worldScale[1] = 1;
		}
		else
		{
			mat4.perspective(45, w / h, this.zNear, this.zFar, this.matP);
			var tl = [0, 0];
			var br = [0, 0];
			this.project(0, 0, tl);
			this.project(1, 1, br);
			this.worldScale[0] = 1 / (br[0] - tl[0]);
			this.worldScale[1] = -1 / (br[1] - tl[1]);
		}
		var i, len, s;
		for (i = 0, len = this.shaderPrograms.length; i < len; i++)
		{
			s = this.shaderPrograms[i];
			s.hasCurrentMatMV = false;
			if (s.locMatP)
			{
				gl.useProgram(s.shaderProgram);
				gl.uniformMatrix4fv(s.locMatP, false, this.matP);
			}
		}
		gl.useProgram(this.shaderPrograms[this.lastProgram].shaderProgram);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.activeTexture(gl.TEXTURE0);
		this.lastTexture0 = null;
		this.lastTexture1 = null;
		if (this.depthBuffer)
		{
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
			gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
			if (!this.attachedDepthBuffer)
			{
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuffer);
				this.attachedDepthBuffer = true;
			}
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			this.renderToTex = null;
		}
	};
	GLWrap_.prototype.resetModelView = function ()
	{
		mat4.lookAt(this.cam, this.look, this.up, this.matMV);
		mat4.scale(this.matMV, this.worldScale);
	};
	GLWrap_.prototype.translate = function (x, y)
	{
		if (x === 0 && y === 0)
			return;
		this.tmpVec3[0] = x;// * this.worldScale[0];
		this.tmpVec3[1] = y;// * this.worldScale[1];
		this.tmpVec3[2] = 0;
		mat4.translate(this.matMV, this.tmpVec3);
	};
	GLWrap_.prototype.scale = function (x, y)
	{
		if (x === 1 && y === 1)
			return;
		this.tmpVec3[0] = x;
		this.tmpVec3[1] = y;
		this.tmpVec3[2] = 1;
		mat4.scale(this.matMV, this.tmpVec3);
	};
	GLWrap_.prototype.rotateZ = function (a)
	{
		if (a === 0)
			return;
		mat4.rotateZ(this.matMV, a);
	};
	GLWrap_.prototype.updateModelView = function()
	{
		if (areMat4sEqual(this.lastMV, this.matMV))
			return;
		var b = this.pushBatch();
		b.type = BATCH_UPDATEMODELVIEW;
		if (b.mat4param)
			mat4.set(this.matMV, b.mat4param);
		else
			b.mat4param = mat4.create(this.matMV);
		mat4.set(this.matMV, this.lastMV);
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	/*
	var debugBatch = false;
	jQuery(document).mousedown(
		function(info) {
			if (info.which === 2)
				debugBatch = true;
		}
	);
	*/
	GLWrap_.prototype.setEarlyZIndex = function (i)
	{
		if (!this.enableFrontToBack)
			return;
		if (i > 32760)
			i = 32760;
		this.currentZ = this.cam[2] - this.zNear - i * this.zIncrement;
	};
	function GLBatchJob(type_, glwrap_)
	{
		this.type = type_;
		this.glwrap = glwrap_;
		this.gl = glwrap_.gl;
		this.opacityParam = 0;		// for setOpacity()
		this.startIndex = 0;		// for quad()
		this.indexCount = 0;		// "
		this.texParam = null;		// for setTexture()
		this.mat4param = null;		// for updateModelView()
		this.shaderParams = [];		// for user parameters
		cr.seal(this);
	};
	GLBatchJob.prototype.doSetEarlyZPass = function ()
	{
		var gl = this.gl;
		var glwrap = this.glwrap;
		if (this.startIndex !== 0)		// enable
		{
			gl.depthMask(true);			// enable depth writes
			gl.colorMask(false, false, false, false);	// disable color writes
			gl.disable(gl.BLEND);		// no color writes so disable blend
			gl.bindFramebuffer(gl.FRAMEBUFFER, glwrap.fbo);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
			gl.clear(gl.DEPTH_BUFFER_BIT);		// auto-clear depth buffer
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			glwrap.isBatchInEarlyZPass = true;
		}
		else
		{
			gl.depthMask(false);		// disable depth writes, only test existing depth values
			gl.colorMask(true, true, true, true);		// enable color writes
			gl.enable(gl.BLEND);		// turn blending back on
			glwrap.isBatchInEarlyZPass = false;
		}
	};
	GLBatchJob.prototype.doSetTexture = function ()
	{
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texParam);
	};
	GLBatchJob.prototype.doSetTexture1 = function ()
	{
		var gl = this.gl;
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.texParam);
		gl.activeTexture(gl.TEXTURE0);
	};
	GLBatchJob.prototype.doSetOpacity = function ()
	{
		var o = this.opacityParam;
		var glwrap = this.glwrap;
		glwrap.currentOpacity = o;
		var curProg = glwrap.currentShader;
		if (curProg.locOpacity && curProg.lpOpacity !== o)
		{
			curProg.lpOpacity = o;
			this.gl.uniform1f(curProg.locOpacity, o);
		}
	};
	GLBatchJob.prototype.doQuad = function ()
	{
		this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, this.startIndex);
	};
	GLBatchJob.prototype.doSetBlend = function ()
	{
		this.gl.blendFunc(this.startIndex, this.indexCount);
	};
	GLBatchJob.prototype.doUpdateModelView = function ()
	{
		var i, len, s, shaderPrograms = this.glwrap.shaderPrograms, currentProgram = this.glwrap.currentProgram;
		for (i = 0, len = shaderPrograms.length; i < len; i++)
		{
			s = shaderPrograms[i];
			if (i === currentProgram && s.locMatMV)
			{
				s.updateMatMV(this.mat4param);
				s.hasCurrentMatMV = true;
			}
			else
				s.hasCurrentMatMV = false;
		}
		mat4.set(this.mat4param, this.glwrap.currentMV);
	};
	GLBatchJob.prototype.doRenderToTexture = function ()
	{
		var gl = this.gl;
		var glwrap = this.glwrap;
		if (this.texParam)
		{
			if (glwrap.lastTexture1 === this.texParam)
			{
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, null);
				glwrap.lastTexture1 = null;
				gl.activeTexture(gl.TEXTURE0);
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, glwrap.fbo);
			if (!glwrap.isBatchInEarlyZPass)
			{
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texParam, 0);
			}
		}
		else
		{
			if (!glwrap.enableFrontToBack)
			{
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	};
	GLBatchJob.prototype.doClear = function ()
	{
		var gl = this.gl;
		var mode = this.startIndex;
		if (mode === 0)			// clear whole surface
		{
			gl.clearColor(this.mat4param[0], this.mat4param[1], this.mat4param[2], this.mat4param[3]);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}
		else if (mode === 1)	// clear rectangle
		{
			gl.enable(gl.SCISSOR_TEST);
			gl.scissor(this.mat4param[0], this.mat4param[1], this.mat4param[2], this.mat4param[3]);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.disable(gl.SCISSOR_TEST);
		}
		else					// clear depth
		{
			gl.clear(gl.DEPTH_BUFFER_BIT);
		}
	};
	GLBatchJob.prototype.doSetDepthTestEnabled = function ()
	{
		var gl = this.gl;
		var enable = this.startIndex;
		if (enable !== 0)
		{
			gl.enable(gl.DEPTH_TEST);
		}
		else
		{
			gl.disable(gl.DEPTH_TEST);
		}
	};
	GLBatchJob.prototype.doPoints = function ()
	{
		var gl = this.gl;
		var glwrap = this.glwrap;
		if (glwrap.enableFrontToBack)
			gl.disable(gl.DEPTH_TEST);
		var s = glwrap.shaderPrograms[1];
		gl.useProgram(s.shaderProgram);
		if (!s.hasCurrentMatMV && s.locMatMV)
		{
			s.updateMatMV(glwrap.currentMV);
			s.hasCurrentMatMV = true;
		}
		gl.enableVertexAttribArray(s.locAPos);
		gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.pointBuffer);
		gl.vertexAttribPointer(s.locAPos, 4, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.POINTS, this.startIndex / 4, this.indexCount);
		s = glwrap.currentShader;
		gl.useProgram(s.shaderProgram);
		if (s.locAPos >= 0)
		{
			gl.enableVertexAttribArray(s.locAPos);
			gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.vertexBuffers[glwrap.curBuffer]);
			gl.vertexAttribPointer(s.locAPos, glwrap.enableFrontToBack ? 3 : 2, gl.FLOAT, false, 0, 0);
		}
		if (s.locATex >= 0)
		{
			gl.enableVertexAttribArray(s.locATex);
			gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.texcoordBuffers[glwrap.curBuffer]);
			gl.vertexAttribPointer(s.locATex, 2, gl.FLOAT, false, 0, 0);
		}
		if (glwrap.enableFrontToBack)
			gl.enable(gl.DEPTH_TEST);
	};
	GLBatchJob.prototype.doSetProgram = function ()
	{
		var gl = this.gl;
		var glwrap = this.glwrap;
		var s = glwrap.shaderPrograms[this.startIndex];		// recycled param to save memory
		glwrap.currentProgram = this.startIndex;			// current batch program
		glwrap.currentShader = s;
		gl.useProgram(s.shaderProgram);						// switch to
		if (!s.hasCurrentMatMV && s.locMatMV)
		{
			s.updateMatMV(glwrap.currentMV);
			s.hasCurrentMatMV = true;
		}
		if (s.locOpacity && s.lpOpacity !== glwrap.currentOpacity)
		{
			s.lpOpacity = glwrap.currentOpacity;
			gl.uniform1f(s.locOpacity, glwrap.currentOpacity);
		}
		if (s.locAPos >= 0)
		{
			gl.enableVertexAttribArray(s.locAPos);
			gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.vertexBuffers[glwrap.curBuffer]);
			gl.vertexAttribPointer(s.locAPos, glwrap.enableFrontToBack ? 3 : 2, gl.FLOAT, false, 0, 0);
		}
		if (s.locATex >= 0)
		{
			gl.enableVertexAttribArray(s.locATex);
			gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.texcoordBuffers[glwrap.curBuffer]);
			gl.vertexAttribPointer(s.locATex, 2, gl.FLOAT, false, 0, 0);
		}
	}
	GLBatchJob.prototype.doSetColor = function ()
	{
		var s = this.glwrap.currentShader;
		var mat4param = this.mat4param;
		this.gl.uniform4f(s.locColorFill, mat4param[0], mat4param[1], mat4param[2], mat4param[3]);
	};
	GLBatchJob.prototype.doSetProgramParameters = function ()
	{
		var i, len, s = this.glwrap.currentShader;
		var gl = this.gl;
		var mat4param = this.mat4param;
		if (s.locSamplerBack && this.glwrap.lastTexture1 !== this.texParam)
		{
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, this.texParam);
			this.glwrap.lastTexture1 = this.texParam;
			gl.activeTexture(gl.TEXTURE0);
		}
		var v = mat4param[0];
		var v2;
		if (s.locPixelWidth && v !== s.lpPixelWidth)
		{
			s.lpPixelWidth = v;
			gl.uniform1f(s.locPixelWidth, v);
		}
		v = mat4param[1];
		if (s.locPixelHeight && v !== s.lpPixelHeight)
		{
			s.lpPixelHeight = v;
			gl.uniform1f(s.locPixelHeight, v);
		}
		v = mat4param[2];
		v2 = mat4param[3];
		if (s.locDestStart && (v !== s.lpDestStartX || v2 !== s.lpDestStartY))
		{
			s.lpDestStartX = v;
			s.lpDestStartY = v2;
			gl.uniform2f(s.locDestStart, v, v2);
		}
		v = mat4param[4];
		v2 = mat4param[5];
		if (s.locDestEnd && (v !== s.lpDestEndX || v2 !== s.lpDestEndY))
		{
			s.lpDestEndX = v;
			s.lpDestEndY = v2;
			gl.uniform2f(s.locDestEnd, v, v2);
		}
		v = mat4param[6];
		if (s.locLayerScale && v !== s.lpLayerScale)
		{
			s.lpLayerScale = v;
			gl.uniform1f(s.locLayerScale, v);
		}
		v = mat4param[7];
		if (s.locLayerAngle && v !== s.lpLayerAngle)
		{
			s.lpLayerAngle = v;
			gl.uniform1f(s.locLayerAngle, v);
		}
		v = mat4param[8];
		v2 = mat4param[9];
		if (s.locViewOrigin && (v !== s.lpViewOriginX || v2 !== s.lpViewOriginY))
		{
			s.lpViewOriginX = v;
			s.lpViewOriginY = v2;
			gl.uniform2f(s.locViewOrigin, v, v2);
		}
		v = mat4param[10];
		v2 = mat4param[11];
		if (s.locScrollPos && (v !== s.lpScrollPosX || v2 !== s.lpScrollPosY))
		{
			s.lpScrollPosX = v;
			s.lpScrollPosY = v2;
			gl.uniform2f(s.locScrollPos, v, v2);
		}
		v = mat4param[12];
		if (s.locSeconds && v !== s.lpSeconds)
		{
			s.lpSeconds = v;
			gl.uniform1f(s.locSeconds, v);
		}
		if (s.parameters.length)
		{
			for (i = 0, len = s.parameters.length; i < len; i++)
			{
				v = this.shaderParams[i];
				if (v !== s.lastCustomParams[i])
				{
					s.lastCustomParams[i] = v;
					gl.uniform1f(s.parameters[i][1], v);
				}
			}
		}
	};
	GLWrap_.prototype.pushBatch = function ()
	{
		if (this.batchPtr === this.batch.length)
			this.batch.push(new GLBatchJob(BATCH_NULL, this));
		return this.batch[this.batchPtr++];
	};
	GLWrap_.prototype.endBatch = function ()
	{
		if (this.batchPtr === 0)
			return;
		if (this.gl.isContextLost())
			return;
		var gl = this.gl;
		if (this.pointPtr > 0)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuffer);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.pointData.subarray(0, this.pointPtr));
			if (s && s.locAPos >= 0 && s.name === "<point>")
				gl.vertexAttribPointer(s.locAPos, 4, gl.FLOAT, false, 0, 0);
		}
		if (this.vertexPtr > 0)
		{
			var s = this.currentShader;
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers[this.curBuffer]);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexData.subarray(0, this.vertexPtr));
			if (s && s.locAPos >= 0 && s.name !== "<point>")
				gl.vertexAttribPointer(s.locAPos, this.enableFrontToBack ? 3 : 2, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffers[this.curBuffer]);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.texcoordData.subarray(0, this.texPtr));
			if (s && s.locATex >= 0 && s.name !== "<point>")
				gl.vertexAttribPointer(s.locATex, 2, gl.FLOAT, false, 0, 0);
		}
		var i, len, b;
		for (i = 0, len = this.batchPtr; i < len; i++)
		{
			b = this.batch[i];
			switch (b.type) {
			case 1:
				b.doQuad();
				break;
			case 2:
				b.doSetTexture();
				break;
			case 3:
				b.doSetOpacity();
				break;
			case 4:
				b.doSetBlend();
				break;
			case 5:
				b.doUpdateModelView();
				break;
			case 6:
				b.doRenderToTexture();
				break;
			case 7:
				b.doClear();
				break;
			case 8:
				b.doPoints();
				break;
			case 9:
				b.doSetProgram();
				break;
			case 10:
				b.doSetProgramParameters();
				break;
			case 11:
				b.doSetTexture1();
				break;
			case 12:
				b.doSetColor();
				break;
			case 13:
				b.doSetDepthTestEnabled();
				break;
			case 14:
				b.doSetEarlyZPass();
				break;
			}
		}
		this.batchPtr = 0;
		this.vertexPtr = 0;
		this.texPtr = 0;
		this.pointPtr = 0;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
		this.isBatchInEarlyZPass = false;
		this.curBuffer++;
		if (this.curBuffer >= MULTI_BUFFERS)
			this.curBuffer = 0;
	};
	GLWrap_.prototype.setOpacity = function (op)
	{
		if (op === this.lastOpacity)
			return;
		if (this.isEarlyZPass)
			return;		// ignore
		var b = this.pushBatch();
		b.type = BATCH_SETOPACITY;
		b.opacityParam = op;
		this.lastOpacity = op;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.setTexture = function (tex)
	{
		if (tex === this.lastTexture0)
			return;
;
		var b = this.pushBatch();
		b.type = BATCH_SETTEXTURE;
		b.texParam = tex;
		this.lastTexture0 = tex;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.setBlend = function (s, d)
	{
		if (s === this.lastSrcBlend && d === this.lastDestBlend)
			return;
		if (this.isEarlyZPass)
			return;		// ignore
		var b = this.pushBatch();
		b.type = BATCH_SETBLEND;
		b.startIndex = s;		// recycle params to save memory
		b.indexCount = d;
		this.lastSrcBlend = s;
		this.lastDestBlend = d;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.isPremultipliedAlphaBlend = function ()
	{
		return (this.lastSrcBlend === this.gl.ONE && this.lastDestBlend === this.gl.ONE_MINUS_SRC_ALPHA);
	};
	GLWrap_.prototype.setAlphaBlend = function ()
	{
		this.setBlend(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
	};
	GLWrap_.prototype.setNoPremultiplyAlphaBlend = function ()
	{
		this.setBlend(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	};
	var LAST_VERTEX = MAX_VERTICES * 2 - 8;
	GLWrap_.prototype.quad = function(tlx, tly, trx, try_, brx, bry, blx, bly)
	{
		if (this.vertexPtr >= LAST_VERTEX)
			this.endBatch();
		var v = this.vertexPtr;			// vertex cursor
		var t = this.texPtr;
		var vd = this.vertexData;		// vertex data array
		var td = this.texcoordData;		// texture coord data array
		var currentZ = this.currentZ;
		if (this.hasQuadBatchTop)
		{
			this.batch[this.batchPtr - 1].indexCount += 6;
		}
		else
		{
			var b = this.pushBatch();
			b.type = BATCH_QUAD;
			b.startIndex = this.enableFrontToBack ? v : (v / 2) * 3;
			b.indexCount = 6;
			this.hasQuadBatchTop = true;
			this.hasPointBatchTop = false;
		}
		if (this.enableFrontToBack)
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = currentZ;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = currentZ;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = currentZ;
			vd[v++] = blx;
			vd[v++] = bly;
			vd[v++] = currentZ;
		}
		else
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = blx;
			vd[v++] = bly;
		}
		td[t++] = 0;
		td[t++] = 0;
		td[t++] = 1;
		td[t++] = 0;
		td[t++] = 1;
		td[t++] = 1;
		td[t++] = 0;
		td[t++] = 1;
		this.vertexPtr = v;
		this.texPtr = t;
	};
	GLWrap_.prototype.quadTex = function(tlx, tly, trx, try_, brx, bry, blx, bly, rcTex)
	{
		if (this.vertexPtr >= LAST_VERTEX)
			this.endBatch();
		var v = this.vertexPtr;			// vertex cursor
		var t = this.texPtr;
		var vd = this.vertexData;		// vertex data array
		var td = this.texcoordData;		// texture coord data array
		var currentZ = this.currentZ;
		if (this.hasQuadBatchTop)
		{
			this.batch[this.batchPtr - 1].indexCount += 6;
		}
		else
		{
			var b = this.pushBatch();
			b.type = BATCH_QUAD;
			b.startIndex = this.enableFrontToBack ? v : (v / 2) * 3;
			b.indexCount = 6;
			this.hasQuadBatchTop = true;
			this.hasPointBatchTop = false;
		}
		var rc_left = rcTex.left;
		var rc_top = rcTex.top;
		var rc_right = rcTex.right;
		var rc_bottom = rcTex.bottom;
		if (this.enableFrontToBack)
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = currentZ;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = currentZ;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = currentZ;
			vd[v++] = blx;
			vd[v++] = bly;
			vd[v++] = currentZ;
		}
		else
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = blx;
			vd[v++] = bly;
		}
		td[t++] = rc_left;
		td[t++] = rc_top;
		td[t++] = rc_right;
		td[t++] = rc_top;
		td[t++] = rc_right;
		td[t++] = rc_bottom;
		td[t++] = rc_left;
		td[t++] = rc_bottom;
		this.vertexPtr = v;
		this.texPtr = t;
	};
	GLWrap_.prototype.quadTexUV = function(tlx, tly, trx, try_, brx, bry, blx, bly, tlu, tlv, tru, trv, bru, brv, blu, blv)
	{
		if (this.vertexPtr >= LAST_VERTEX)
			this.endBatch();
		var v = this.vertexPtr;			// vertex cursor
		var t = this.texPtr;
		var vd = this.vertexData;		// vertex data array
		var td = this.texcoordData;		// texture coord data array
		var currentZ = this.currentZ;
		if (this.hasQuadBatchTop)
		{
			this.batch[this.batchPtr - 1].indexCount += 6;
		}
		else
		{
			var b = this.pushBatch();
			b.type = BATCH_QUAD;
			b.startIndex = this.enableFrontToBack ? v : (v / 2) * 3;
			b.indexCount = 6;
			this.hasQuadBatchTop = true;
			this.hasPointBatchTop = false;
		}
		if (this.enableFrontToBack)
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = currentZ;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = currentZ;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = currentZ;
			vd[v++] = blx;
			vd[v++] = bly;
			vd[v++] = currentZ;
		}
		else
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = blx;
			vd[v++] = bly;
		}
		td[t++] = tlu;
		td[t++] = tlv;
		td[t++] = tru;
		td[t++] = trv;
		td[t++] = bru;
		td[t++] = brv;
		td[t++] = blu;
		td[t++] = blv;
		this.vertexPtr = v;
		this.texPtr = t;
	};
	GLWrap_.prototype.convexPoly = function(pts)
	{
		var pts_count = pts.length / 2;
;
		var tris = pts_count - 2;	// 3 points = 1 tri, 4 points = 2 tris, 5 points = 3 tris etc.
		var last_tri = tris - 1;
		var p0x = pts[0];
		var p0y = pts[1];
		var i, i2, p1x, p1y, p2x, p2y, p3x, p3y;
		for (i = 0; i < tris; i += 2)		// draw 2 triangles at a time
		{
			i2 = i * 2;
			p1x = pts[i2 + 2];
			p1y = pts[i2 + 3];
			p2x = pts[i2 + 4];
			p2y = pts[i2 + 5];
			if (i === last_tri)
			{
				this.quad(p0x, p0y, p1x, p1y, p2x, p2y, p2x, p2y);
			}
			else
			{
				p3x = pts[i2 + 6];
				p3y = pts[i2 + 7];
				this.quad(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);
			}
		}
	};
	var LAST_POINT = MAX_POINTS - 4;
	GLWrap_.prototype.point = function(x_, y_, size_, opacity_)
	{
		if (this.pointPtr >= LAST_POINT)
			this.endBatch();
		var p = this.pointPtr;			// point cursor
		var pd = this.pointData;		// point data array
		if (this.hasPointBatchTop)
		{
			this.batch[this.batchPtr - 1].indexCount++;
		}
		else
		{
			var b = this.pushBatch();
			b.type = BATCH_POINTS;
			b.startIndex = p;
			b.indexCount = 1;
			this.hasPointBatchTop = true;
			this.hasQuadBatchTop = false;
		}
		pd[p++] = x_;
		pd[p++] = y_;
		pd[p++] = size_;
		pd[p++] = opacity_;
		this.pointPtr = p;
	};
	GLWrap_.prototype.switchProgram = function (progIndex)
	{
		if (this.lastProgram === progIndex)
			return;			// no change
		var shaderProg = this.shaderPrograms[progIndex];
		if (!shaderProg)
		{
			if (this.lastProgram === 0)
				return;								// already on default shader
			progIndex = 0;
			shaderProg = this.shaderPrograms[0];
		}
		var b = this.pushBatch();
		b.type = BATCH_SETPROGRAM;
		b.startIndex = progIndex;
		this.lastProgram = progIndex;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.programUsesDest = function (progIndex)
	{
		var s = this.shaderPrograms[progIndex];
		return !!(s.locDestStart || s.locDestEnd);
	};
	GLWrap_.prototype.programUsesCrossSampling = function (progIndex)
	{
		var s = this.shaderPrograms[progIndex];
		return !!(s.locDestStart || s.locDestEnd || s.crossSampling);
	};
	GLWrap_.prototype.programPreservesOpaqueness = function (progIndex)
	{
		return this.shaderPrograms[progIndex].preservesOpaqueness;
	};
	GLWrap_.prototype.programExtendsBox = function (progIndex)
	{
		var s = this.shaderPrograms[progIndex];
		return s.extendBoxHorizontal !== 0 || s.extendBoxVertical !== 0;
	};
	GLWrap_.prototype.getProgramBoxExtendHorizontal = function (progIndex)
	{
		return this.shaderPrograms[progIndex].extendBoxHorizontal;
	};
	GLWrap_.prototype.getProgramBoxExtendVertical = function (progIndex)
	{
		return this.shaderPrograms[progIndex].extendBoxVertical;
	};
	GLWrap_.prototype.getProgramParameterType = function (progIndex, paramIndex)
	{
		return this.shaderPrograms[progIndex].parameters[paramIndex][2];
	};
	GLWrap_.prototype.programIsAnimated = function (progIndex)
	{
		return this.shaderPrograms[progIndex].animated;
	};
	GLWrap_.prototype.setProgramParameters = function (backTex, pixelWidth, pixelHeight, destStartX, destStartY, destEndX, destEndY, layerScale, layerAngle, viewOriginLeft, viewOriginTop, scrollPosX, scrollPosY, seconds, params)
	{
		var i, len;
		var s = this.shaderPrograms[this.lastProgram];
		var b, mat4param, shaderParams;
		if (s.hasAnyOptionalUniforms || params.length)
		{
			b = this.pushBatch();
			b.type = BATCH_SETPROGRAMPARAMETERS;
			if (b.mat4param)
				mat4.set(this.matMV, b.mat4param);
			else
				b.mat4param = mat4.create();
			mat4param = b.mat4param;
			mat4param[0] = pixelWidth;
			mat4param[1] = pixelHeight;
			mat4param[2] = destStartX;
			mat4param[3] = destStartY;
			mat4param[4] = destEndX;
			mat4param[5] = destEndY;
			mat4param[6] = layerScale;
			mat4param[7] = layerAngle;
			mat4param[8] = viewOriginLeft;
			mat4param[9] = viewOriginTop;
			mat4param[10] = scrollPosX;
			mat4param[11] = scrollPosY;
			mat4param[12] = seconds;
			if (s.locSamplerBack)
			{
;
				b.texParam = backTex;
			}
			else
				b.texParam = null;
			if (params.length)
			{
				shaderParams = b.shaderParams;
				shaderParams.length = params.length;
				for (i = 0, len = params.length; i < len; i++)
					shaderParams[i] = params[i];
			}
			this.hasQuadBatchTop = false;
			this.hasPointBatchTop = false;
		}
	};
	GLWrap_.prototype.clear = function (r, g, b_, a)
	{
		var b = this.pushBatch();
		b.type = BATCH_CLEAR;
		b.startIndex = 0;					// clear all mode
		if (!b.mat4param)
			b.mat4param = mat4.create();
		b.mat4param[0] = r;
		b.mat4param[1] = g;
		b.mat4param[2] = b_;
		b.mat4param[3] = a;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.clearRect = function (x, y, w, h)
	{
		if (w < 0 || h < 0)
			return;							// invalid clear area
		var b = this.pushBatch();
		b.type = BATCH_CLEAR;
		b.startIndex = 1;					// clear rect mode
		if (!b.mat4param)
			b.mat4param = mat4.create();
		b.mat4param[0] = x;
		b.mat4param[1] = y;
		b.mat4param[2] = w;
		b.mat4param[3] = h;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.clearDepth = function ()
	{
		var b = this.pushBatch();
		b.type = BATCH_CLEAR;
		b.startIndex = 2;					// clear depth mode
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.setEarlyZPass = function (e)
	{
		if (!this.enableFrontToBack)
			return;		// no depth buffer in use
		e = !!e;
		if (this.isEarlyZPass === e)
			return;		// no change
		var b = this.pushBatch();
		b.type = BATCH_SETEARLYZMODE;
		b.startIndex = (e ? 1 : 0);
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
		this.isEarlyZPass = e;
		this.renderToTex = null;
		if (this.isEarlyZPass)
		{
			this.switchProgram(2);		// early Z program
		}
		else
		{
			this.switchProgram(0);		// normal rendering
		}
	};
	GLWrap_.prototype.setDepthTestEnabled = function (e)
	{
		if (!this.enableFrontToBack)
			return;		// no depth buffer in use
		var b = this.pushBatch();
		b.type = BATCH_SETDEPTHTEST;
		b.startIndex = (e ? 1 : 0);
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.fullscreenQuad = function ()
	{
		mat4.set(this.lastMV, tempMat4);
		this.resetModelView();
		this.updateModelView();
		var halfw = this.width / 2;
		var halfh = this.height / 2;
		this.quad(-halfw, halfh, halfw, halfh, halfw, -halfh, -halfw, -halfh);
		mat4.set(tempMat4, this.matMV);
		this.updateModelView();
	};
	GLWrap_.prototype.setColorFillMode = function (r_, g_, b_, a_)
	{
		this.switchProgram(3);
		var b = this.pushBatch();
		b.type = BATCH_SETCOLOR;
		if (!b.mat4param)
			b.mat4param = mat4.create();
		b.mat4param[0] = r_;
		b.mat4param[1] = g_;
		b.mat4param[2] = b_;
		b.mat4param[3] = a_;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.setTextureFillMode = function ()
	{
;
		this.switchProgram(0);
	};
	GLWrap_.prototype.restoreEarlyZMode = function ()
	{
;
		this.switchProgram(2);
	};
	GLWrap_.prototype.present = function ()
	{
		this.endBatch();
		this.gl.flush();
		/*
		if (debugBatch)
		{
;
			debugBatch = false;
		}
		*/
	};
	function nextHighestPowerOfTwo(x) {
		--x;
		for (var i = 1; i < 32; i <<= 1) {
			x = x | x >> i;
		}
		return x + 1;
	}
	var all_textures = [];
	var textures_by_src = {};
	GLWrap_.prototype.contextLost = function ()
	{
		cr.clearArray(all_textures);
		textures_by_src = {};
	};
	var BF_RGBA8 = 0;
	var BF_RGB8 = 1;
	var BF_RGBA4 = 2;
	var BF_RGB5_A1 = 3;
	var BF_RGB565 = 4;
	GLWrap_.prototype.loadTexture = function (img, tiling, linearsampling, pixelformat, tiletype, nomip)
	{
		tiling = !!tiling;
		linearsampling = !!linearsampling;
		var tex_key = img.src + "," + tiling + "," + linearsampling + (tiling ? ("," + tiletype) : "");
		var webGL_texture = null;
		if (typeof img.src !== "undefined" && textures_by_src.hasOwnProperty(tex_key))
		{
			webGL_texture = textures_by_src[tex_key];
			webGL_texture.c2refcount++;
			return webGL_texture;
		}
		this.endBatch();
;
		var gl = this.gl;
		var isPOT = (cr.isPOT(img.width) && cr.isPOT(img.height));
		webGL_texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, webGL_texture);
		gl.pixelStorei(gl["UNPACK_PREMULTIPLY_ALPHA_WEBGL"], true);
		var internalformat = gl.RGBA;
		var format = gl.RGBA;
		var type = gl.UNSIGNED_BYTE;
		if (pixelformat && !this.isIE)
		{
			switch (pixelformat) {
			case BF_RGB8:
				internalformat = gl.RGB;
				format = gl.RGB;
				break;
			case BF_RGBA4:
				type = gl.UNSIGNED_SHORT_4_4_4_4;
				break;
			case BF_RGB5_A1:
				type = gl.UNSIGNED_SHORT_5_5_5_1;
				break;
			case BF_RGB565:
				internalformat = gl.RGB;
				format = gl.RGB;
				type = gl.UNSIGNED_SHORT_5_6_5;
				break;
			}
		}
		if (this.version === 1 && !isPOT && tiling)
		{
			var canvas = document.createElement("canvas");
			canvas.width = cr.nextHighestPowerOfTwo(img.width);
			canvas.height = cr.nextHighestPowerOfTwo(img.height);
			var ctx = canvas.getContext("2d");
			if (typeof ctx["imageSmoothingEnabled"] !== "undefined")
			{
				ctx["imageSmoothingEnabled"] = linearsampling;
			}
			else
			{
				ctx["webkitImageSmoothingEnabled"] = linearsampling;
				ctx["mozImageSmoothingEnabled"] = linearsampling;
				ctx["msImageSmoothingEnabled"] = linearsampling;
			}
			ctx.drawImage(img,
						  0, 0, img.width, img.height,
						  0, 0, canvas.width, canvas.height);
			gl.texImage2D(gl.TEXTURE_2D, 0, internalformat, format, type, canvas);
		}
		else
			gl.texImage2D(gl.TEXTURE_2D, 0, internalformat, format, type, img);
		if (tiling)
		{
			if (tiletype === "repeat-x")
			{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			}
			else if (tiletype === "repeat-y")
			{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			}
			else
			{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			}
		}
		else
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
		if (linearsampling)
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			if ((isPOT || this.version >= 2) && this.enable_mipmaps && !nomip)
			{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
				gl.generateMipmap(gl.TEXTURE_2D);
			}
			else
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
		else
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		}
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.lastTexture0 = null;
		webGL_texture.c2width = img.width;
		webGL_texture.c2height = img.height;
		webGL_texture.c2refcount = 1;
		webGL_texture.c2texkey = tex_key;
		all_textures.push(webGL_texture);
		textures_by_src[tex_key] = webGL_texture;
		return webGL_texture;
	};
	GLWrap_.prototype.createEmptyTexture = function (w, h, linearsampling, _16bit, tiling)
	{
		this.endBatch();
		var gl = this.gl;
		if (this.isIE)
			_16bit = false;
		var webGL_texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, webGL_texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, _16bit ? gl.UNSIGNED_SHORT_4_4_4_4 : gl.UNSIGNED_BYTE, null);
		if (tiling)
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		}
		else
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linearsampling ? gl.LINEAR : gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linearsampling ? gl.LINEAR : gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.lastTexture0 = null;
		webGL_texture.c2width = w;
		webGL_texture.c2height = h;
		all_textures.push(webGL_texture);
		return webGL_texture;
	};
	GLWrap_.prototype.videoToTexture = function (video_, texture_, _16bit)
	{
		this.endBatch();
		var gl = this.gl;
		if (this.isIE)
			_16bit = false;
		gl.bindTexture(gl.TEXTURE_2D, texture_);
		gl.pixelStorei(gl["UNPACK_PREMULTIPLY_ALPHA_WEBGL"], true);
		try {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, _16bit ? gl.UNSIGNED_SHORT_4_4_4_4 : gl.UNSIGNED_BYTE, video_);
		}
		catch (e)
		{
			if (console && console.error)
				console.error("Error updating WebGL texture: ", e);
		}
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.lastTexture0 = null;
	};
	GLWrap_.prototype.deleteTexture = function (tex)
	{
		if (!tex)
			return;
		if (typeof tex.c2refcount !== "undefined" && tex.c2refcount > 1)
		{
			tex.c2refcount--;
			return;
		}
		this.endBatch();
		if (tex === this.lastTexture0)
		{
			this.gl.bindTexture(this.gl.TEXTURE_2D, null);
			this.lastTexture0 = null;
		}
		if (tex === this.lastTexture1)
		{
			this.gl.activeTexture(this.gl.TEXTURE1);
			this.gl.bindTexture(this.gl.TEXTURE_2D, null);
			this.gl.activeTexture(this.gl.TEXTURE0);
			this.lastTexture1 = null;
		}
		cr.arrayFindRemove(all_textures, tex);
		if (typeof tex.c2texkey !== "undefined")
			delete textures_by_src[tex.c2texkey];
		this.gl.deleteTexture(tex);
	};
	GLWrap_.prototype.estimateVRAM = function ()
	{
		var total = this.width * this.height * 4 * 2;
		var i, len, t;
		for (i = 0, len = all_textures.length; i < len; i++)
		{
			t = all_textures[i];
			total += (t.c2width * t.c2height * 4);
		}
		return total;
	};
	GLWrap_.prototype.textureCount = function ()
	{
		return all_textures.length;
	};
	GLWrap_.prototype.setRenderingToTexture = function (tex)
	{
		if (tex === this.renderToTex)
			return;
;
		var b = this.pushBatch();
		b.type = BATCH_RENDERTOTEXTURE;
		b.texParam = tex;
		this.renderToTex = tex;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	cr.GLWrap = GLWrap_;
}());
;
(function()
{
	var raf = window["requestAnimationFrame"] ||
	  window["mozRequestAnimationFrame"]    ||
	  window["webkitRequestAnimationFrame"] ||
	  window["msRequestAnimationFrame"]     ||
	  window["oRequestAnimationFrame"];
	function Runtime(canvas)
	{
		if (!canvas || (!canvas.getContext && !canvas["dc"]))
			return;
		if (canvas["c2runtime"])
			return;
		else
			canvas["c2runtime"] = this;
		var self = this;
		this.isCrosswalk = /crosswalk/i.test(navigator.userAgent) || /xwalk/i.test(navigator.userAgent) || !!(typeof window["c2isCrosswalk"] !== "undefined" && window["c2isCrosswalk"]);
		this.isCordova = this.isCrosswalk || (typeof window["device"] !== "undefined" && (typeof window["device"]["cordova"] !== "undefined" || typeof window["device"]["phonegap"] !== "undefined")) || (typeof window["c2iscordova"] !== "undefined" && window["c2iscordova"]);
		this.isPhoneGap = this.isCordova;
		this.isDirectCanvas = !!canvas["dc"];
		this.isAppMobi = (typeof window["AppMobi"] !== "undefined" || this.isDirectCanvas);
		this.isCocoonJs = !!window["c2cocoonjs"];
		this.isEjecta = !!window["c2ejecta"];
		if (this.isCocoonJs)
		{
			CocoonJS["App"]["onSuspended"].addEventListener(function() {
				self["setSuspended"](true);
			});
			CocoonJS["App"]["onActivated"].addEventListener(function () {
				self["setSuspended"](false);
			});
		}
		if (this.isEjecta)
		{
			document.addEventListener("pagehide", function() {
				self["setSuspended"](true);
			});
			document.addEventListener("pageshow", function() {
				self["setSuspended"](false);
			});
			document.addEventListener("resize", function () {
				self["setSize"](window.innerWidth, window.innerHeight);
			});
		}
		this.isDomFree = (this.isDirectCanvas || this.isCocoonJs || this.isEjecta);
		this.isMicrosoftEdge = /edge\//i.test(navigator.userAgent);
		this.isIE = (/msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent) || /iemobile/i.test(navigator.userAgent)) && !this.isMicrosoftEdge;
		this.isTizen = /tizen/i.test(navigator.userAgent);
		this.isAndroid = /android/i.test(navigator.userAgent) && !this.isTizen && !this.isIE && !this.isMicrosoftEdge;		// IE mobile and Tizen masquerade as Android
		this.isiPhone = (/iphone/i.test(navigator.userAgent) || /ipod/i.test(navigator.userAgent)) && !this.isIE && !this.isMicrosoftEdge;	// treat ipod as an iphone; IE mobile masquerades as iPhone
		this.isiPad = /ipad/i.test(navigator.userAgent);
		this.isiOS = this.isiPhone || this.isiPad || this.isEjecta;
		this.isiPhoneiOS6 = (this.isiPhone && /os\s6/i.test(navigator.userAgent));
		this.isChrome = (/chrome/i.test(navigator.userAgent) || /chromium/i.test(navigator.userAgent)) && !this.isIE && !this.isMicrosoftEdge;	// note true on Chromium-based webview on Android 4.4+; IE 'Edge' mode also pretends to be Chrome
		this.isAmazonWebApp = /amazonwebappplatform/i.test(navigator.userAgent);
		this.isFirefox = /firefox/i.test(navigator.userAgent);
		this.isSafari = /safari/i.test(navigator.userAgent) && !this.isChrome && !this.isIE && !this.isMicrosoftEdge;		// Chrome and IE Mobile masquerade as Safari
		this.isWindows = /windows/i.test(navigator.userAgent);
		this.isNWjs = (typeof window["c2nodewebkit"] !== "undefined" || typeof window["c2nwjs"] !== "undefined" || /nodewebkit/i.test(navigator.userAgent) || /nwjs/i.test(navigator.userAgent));
		this.isNodeWebkit = this.isNWjs;		// old name for backwards compat
		this.isArcade = (typeof window["is_scirra_arcade"] !== "undefined");
		this.isWindows8App = !!(typeof window["c2isWindows8"] !== "undefined" && window["c2isWindows8"]);
		this.isWindows8Capable = !!(typeof window["c2isWindows8Capable"] !== "undefined" && window["c2isWindows8Capable"]);
		this.isWindowsPhone8 = !!(typeof window["c2isWindowsPhone8"] !== "undefined" && window["c2isWindowsPhone8"]);
		this.isWindowsPhone81 = !!(typeof window["c2isWindowsPhone81"] !== "undefined" && window["c2isWindowsPhone81"]);
		this.isWindows10 = !!window["cr_windows10"];
		this.isWinJS = (this.isWindows8App || this.isWindows8Capable || this.isWindowsPhone81 || this.isWindows10);	// note not WP8.0
		this.isBlackberry10 = !!(typeof window["c2isBlackberry10"] !== "undefined" && window["c2isBlackberry10"]);
		this.isAndroidStockBrowser = (this.isAndroid && !this.isChrome && !this.isCrosswalk && !this.isFirefox && !this.isAmazonWebApp && !this.isDomFree);
		this.devicePixelRatio = 1;
		this.isMobile = (this.isCordova || this.isCrosswalk || this.isAppMobi || this.isCocoonJs || this.isAndroid || this.isiOS || this.isWindowsPhone8 || this.isWindowsPhone81 || this.isBlackberry10 || this.isTizen || this.isEjecta);
		if (!this.isMobile)
		{
			this.isMobile = /(blackberry|bb10|playbook|palm|symbian|nokia|windows\s+ce|phone|mobile|tablet|kindle|silk)/i.test(navigator.userAgent);
		}
		this.isWKWebView = !!(this.isiOS && this.isCordova && window["webkit"]);
		if (typeof cr_is_preview !== "undefined" && !this.isNWjs && (window.location.search === "?nw" || /nodewebkit/i.test(navigator.userAgent) || /nwjs/i.test(navigator.userAgent)))
		{
			this.isNWjs = true;
		}
		this.isDebug = (typeof cr_is_preview !== "undefined" && window.location.search.indexOf("debug") > -1);
		this.canvas = canvas;
		this.canvasdiv = document.getElementById("c2canvasdiv");
		this.gl = null;
		this.glwrap = null;
		this.glUnmaskedRenderer = "(unavailable)";
		this.enableFrontToBack = false;
		this.earlyz_index = 0;
		this.ctx = null;
		this.firstInFullscreen = false;
		this.oldWidth = 0;		// for restoring non-fullscreen canvas after fullscreen
		this.oldHeight = 0;
		this.canvas.oncontextmenu = function (e) { if (e.preventDefault) e.preventDefault(); return false; };
		this.canvas.onselectstart = function (e) { if (e.preventDefault) e.preventDefault(); return false; };
		this.canvas.ontouchstart = function (e) { if(e.preventDefault) e.preventDefault(); return false; };
		if (this.isDirectCanvas)
			window["c2runtime"] = this;
		if (this.isNWjs)
		{
			window["ondragover"] = function(e) { e.preventDefault(); return false; };
			window["ondrop"] = function(e) { e.preventDefault(); return false; };
			if (window["nwgui"] && window["nwgui"]["App"]["clearCache"])
				window["nwgui"]["App"]["clearCache"]();
		}
		if (this.isAndroidStockBrowser && typeof jQuery !== "undefined")
		{
			jQuery("canvas").parents("*").css("overflow", "visible");
		}
		this.width = canvas.width;
		this.height = canvas.height;
		this.draw_width = this.width;
		this.draw_height = this.height;
		this.cssWidth = this.width;
		this.cssHeight = this.height;
		this.lastWindowWidth = window.innerWidth;
		this.lastWindowHeight = window.innerHeight;
		this.forceCanvasAlpha = false;		// note: now unused, left for backwards compat since plugins could modify it
		this.redraw = true;
		this.isSuspended = false;
		if (!Date.now) {
		  Date.now = function now() {
			return +new Date();
		  };
		}
		this.plugins = [];
		this.types = {};
		this.types_by_index = [];
		this.behaviors = [];
		this.layouts = {};
		this.layouts_by_index = [];
		this.eventsheets = {};
		this.eventsheets_by_index = [];
		this.wait_for_textures = [];        // for blocking until textures loaded
		this.triggers_to_postinit = [];
		this.all_global_vars = [];
		this.all_local_vars = [];
		this.solidBehavior = null;
		this.jumpthruBehavior = null;
		this.shadowcasterBehavior = null;
		this.deathRow = {};
		this.hasPendingInstances = false;		// true if anything exists in create row or death row
		this.isInClearDeathRow = false;
		this.isInOnDestroy = 0;					// needs to support recursion so increments and decrements and is true if > 0
		this.isRunningEvents = false;
		this.isEndingLayout = false;
		this.createRow = [];
		this.isLoadingState = false;
		this.saveToSlot = "";
		this.loadFromSlot = "";
		this.loadFromJson = null;			// set to string when there is something to try to load
		this.lastSaveJson = "";
		this.signalledContinuousPreview = false;
		this.suspendDrawing = false;		// for hiding display until continuous preview loads
		this.fireOnCreateAfterLoad = [];	// for delaying "On create" triggers until loading complete
		this.dt = 0;
        this.dt1 = 0;
		this.minimumFramerate = 30;
		this.logictime = 0;			// used to calculate CPUUtilisation
		this.cpuutilisation = 0;
        this.timescale = 1.0;
        this.kahanTime = new cr.KahanAdder();
		this.wallTime = new cr.KahanAdder();
		this.last_tick_time = 0;
		this.fps = 0;
		this.last_fps_time = 0;
		this.tickcount = 0;
		this.tickcount_nosave = 0;	// same as tickcount but never saved/loaded
		this.execcount = 0;
		this.framecount = 0;        // for fps
		this.objectcount = 0;
		this.changelayout = null;
		this.destroycallbacks = [];
		this.event_stack = [];
		this.event_stack_index = -1;
		this.localvar_stack = [[]];
		this.localvar_stack_index = 0;
		this.trigger_depth = 0;		// recursion depth for triggers
		this.pushEventStack(null);
		this.loop_stack = [];
		this.loop_stack_index = -1;
		this.next_uid = 0;
		this.next_puid = 0;		// permanent unique ids
		this.layout_first_tick = true;
		this.family_count = 0;
		this.suspend_events = [];
		this.raf_id = -1;
		this.timeout_id = -1;
		this.isloading = true;
		this.loadingprogress = 0;
		this.isNodeFullscreen = false;
		this.stackLocalCount = 0;	// number of stack-based local vars for recursion
		this.audioInstance = null;
		this.had_a_click = false;
		this.isInUserInputEvent = false;
		this.objects_to_pretick = new cr.ObjectSet();
        this.objects_to_tick = new cr.ObjectSet();
		this.objects_to_tick2 = new cr.ObjectSet();
		this.registered_collisions = [];
		this.temp_poly = new cr.CollisionPoly([]);
		this.temp_poly2 = new cr.CollisionPoly([]);
		this.allGroups = [];				// array of all event groups
        this.groups_by_name = {};
		this.cndsBySid = {};
		this.actsBySid = {};
		this.varsBySid = {};
		this.blocksBySid = {};
		this.running_layout = null;			// currently running layout
		this.layer_canvas = null;			// for layers "render-to-texture"
		this.layer_ctx = null;
		this.layer_tex = null;
		this.layout_tex = null;
		this.layout_canvas = null;
		this.layout_ctx = null;
		this.is_WebGL_context_lost = false;
		this.uses_background_blending = false;	// if any shader uses background blending, so entire layout renders to texture
		this.fx_tex = [null, null];
		this.fullscreen_scaling = 0;
		this.files_subfolder = "";			// path with project files
		this.objectsByUid = {};				// maps every in-use UID (as a string) to its instance
		this.loaderlogos = null;
		this.snapshotCanvas = null;
		this.snapshotData = "";
		this.objectRefTable = [];
		this.requestProjectData();
	};
	Runtime.prototype.requestProjectData = function ()
	{
		var self = this;
		if (this.isWKWebView)
		{
			this.fetchLocalFileViaCordovaAsText("data.js", function (str)
			{
				self.loadProject(JSON.parse(str));
			}, function (err)
			{
				alert("Error fetching data.js");
			});
			return;
		}
		var xhr;
		if (this.isWindowsPhone8)
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		else
			xhr = new XMLHttpRequest();
		var datajs_filename = "data.js";
		if (this.isWindows8App || this.isWindowsPhone8 || this.isWindowsPhone81 || this.isWindows10)
			datajs_filename = "data.json";
		xhr.open("GET", datajs_filename, true);
		var supportsJsonResponse = false;
		if (!this.isDomFree && ("response" in xhr) && ("responseType" in xhr))
		{
			try {
				xhr["responseType"] = "json";
				supportsJsonResponse = (xhr["responseType"] === "json");
			}
			catch (e) {
				supportsJsonResponse = false;
			}
		}
		if (!supportsJsonResponse && ("responseType" in xhr))
		{
			try {
				xhr["responseType"] = "text";
			}
			catch (e) {}
		}
		if ("overrideMimeType" in xhr)
		{
			try {
				xhr["overrideMimeType"]("application/json; charset=utf-8");
			}
			catch (e) {}
		}
		if (this.isWindowsPhone8)
		{
			xhr.onreadystatechange = function ()
			{
				if (xhr.readyState !== 4)
					return;
				self.loadProject(JSON.parse(xhr["responseText"]));
			};
		}
		else
		{
			xhr.onload = function ()
			{
				if (supportsJsonResponse)
				{
					self.loadProject(xhr["response"]);					// already parsed by browser
				}
				else
				{
					if (self.isEjecta)
					{
						var str = xhr["responseText"];
						str = str.substr(str.indexOf("{"));		// trim any BOM
						self.loadProject(JSON.parse(str));
					}
					else
					{
						self.loadProject(JSON.parse(xhr["responseText"]));	// forced to sync parse JSON
					}
				}
			};
			xhr.onerror = function (e)
			{
				cr.logerror("Error requesting " + datajs_filename + ":");
				cr.logerror(e);
			};
		}
		xhr.send();
	};
	Runtime.prototype.initRendererAndLoader = function ()
	{
		var self = this;
		var i, len, j, lenj, k, lenk, t, s, l, y;
		this.isRetina = ((!this.isDomFree || this.isEjecta || this.isCordova) && this.useHighDpi && !this.isAndroidStockBrowser);
		if (this.fullscreen_mode === 0 && this.isiOS)
			this.isRetina = false;
		this.devicePixelRatio = (this.isRetina ? (window["devicePixelRatio"] || window["webkitDevicePixelRatio"] || window["mozDevicePixelRatio"] || window["msDevicePixelRatio"] || 1) : 1);
		this.ClearDeathRow();
		var attribs;
		if (this.fullscreen_mode > 0)
			this["setSize"](window.innerWidth, window.innerHeight, true);
		this.canvas.addEventListener("webglcontextlost", function (ev) {
			ev.preventDefault();
			self.onContextLost();
			cr.logexport("[Construct 2] WebGL context lost");
			window["cr_setSuspended"](true);		// stop rendering
		}, false);
		this.canvas.addEventListener("webglcontextrestored", function (ev) {
			self.glwrap.initState();
			self.glwrap.setSize(self.glwrap.width, self.glwrap.height, true);
			self.layer_tex = null;
			self.layout_tex = null;
			self.fx_tex[0] = null;
			self.fx_tex[1] = null;
			self.onContextRestored();
			self.redraw = true;
			cr.logexport("[Construct 2] WebGL context restored");
			window["cr_setSuspended"](false);		// resume rendering
		}, false);
		try {
			if (this.enableWebGL && (this.isCocoonJs || this.isEjecta || !this.isDomFree))
			{
				attribs = {
					"alpha": true,
					"depth": false,
					"antialias": false,
					"powerPreference": "high-performance",
					"failIfMajorPerformanceCaveat": true
				};
				this.gl = (this.canvas.getContext("webgl2", attribs) ||
						   this.canvas.getContext("webgl", attribs) ||
						   this.canvas.getContext("experimental-webgl", attribs));
			}
		}
		catch (e) {
		}
		if (this.gl)
		{
			var isWebGL2 = (this.gl.getParameter(this.gl.VERSION).indexOf("WebGL 2") === 0);
			var debug_ext = this.gl.getExtension("WEBGL_debug_renderer_info");
			if (debug_ext)
			{
				var unmasked_vendor = this.gl.getParameter(debug_ext.UNMASKED_VENDOR_WEBGL);
				var unmasked_renderer = this.gl.getParameter(debug_ext.UNMASKED_RENDERER_WEBGL);
				this.glUnmaskedRenderer = unmasked_renderer + " [" + unmasked_vendor + "]";
			}
			if (this.enableFrontToBack)
				this.glUnmaskedRenderer += " [front-to-back enabled]";
;
			if (!this.isDomFree)
			{
				this.overlay_canvas = document.createElement("canvas");
				jQuery(this.overlay_canvas).appendTo(this.canvas.parentNode);
				this.overlay_canvas.oncontextmenu = function (e) { return false; };
				this.overlay_canvas.onselectstart = function (e) { return false; };
				this.overlay_canvas.width = Math.round(this.cssWidth * this.devicePixelRatio);
				this.overlay_canvas.height = Math.round(this.cssHeight * this.devicePixelRatio);
				jQuery(this.overlay_canvas).css({"width": this.cssWidth + "px",
												"height": this.cssHeight + "px"});
				this.positionOverlayCanvas();
				this.overlay_ctx = this.overlay_canvas.getContext("2d");
			}
			this.glwrap = new cr.GLWrap(this.gl, this.isMobile, this.enableFrontToBack);
			this.glwrap.setSize(this.canvas.width, this.canvas.height);
			this.glwrap.enable_mipmaps = (this.downscalingQuality !== 0);
			this.ctx = null;
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				t = this.types_by_index[i];
				for (j = 0, lenj = t.effect_types.length; j < lenj; j++)
				{
					s = t.effect_types[j];
					s.shaderindex = this.glwrap.getShaderIndex(s.id);
					s.preservesOpaqueness = this.glwrap.programPreservesOpaqueness(s.shaderindex);
					this.uses_background_blending = this.uses_background_blending || this.glwrap.programUsesDest(s.shaderindex);
				}
			}
			for (i = 0, len = this.layouts_by_index.length; i < len; i++)
			{
				l = this.layouts_by_index[i];
				for (j = 0, lenj = l.effect_types.length; j < lenj; j++)
				{
					s = l.effect_types[j];
					s.shaderindex = this.glwrap.getShaderIndex(s.id);
					s.preservesOpaqueness = this.glwrap.programPreservesOpaqueness(s.shaderindex);
				}
				l.updateActiveEffects();		// update preserves opaqueness flag
				for (j = 0, lenj = l.layers.length; j < lenj; j++)
				{
					y = l.layers[j];
					for (k = 0, lenk = y.effect_types.length; k < lenk; k++)
					{
						s = y.effect_types[k];
						s.shaderindex = this.glwrap.getShaderIndex(s.id);
						s.preservesOpaqueness = this.glwrap.programPreservesOpaqueness(s.shaderindex);
						this.uses_background_blending = this.uses_background_blending || this.glwrap.programUsesDest(s.shaderindex);
					}
					y.updateActiveEffects();		// update preserves opaqueness flag
				}
			}
		}
		else
		{
			if (this.fullscreen_mode > 0 && this.isDirectCanvas)
			{
;
				this.canvas = null;
				document.oncontextmenu = function (e) { return false; };
				document.onselectstart = function (e) { return false; };
				this.ctx = AppMobi["canvas"]["getContext"]("2d");
				try {
					this.ctx["samplingMode"] = this.linearSampling ? "smooth" : "sharp";
					this.ctx["globalScale"] = 1;
					this.ctx["HTML5CompatibilityMode"] = true;
					this.ctx["imageSmoothingEnabled"] = this.linearSampling;
				} catch(e){}
				if (this.width !== 0 && this.height !== 0)
				{
					this.ctx.width = this.width;
					this.ctx.height = this.height;
				}
			}
			if (!this.ctx)
			{
;
				if (this.isCocoonJs)
				{
					attribs = {
						"antialias": !!this.linearSampling,
						"alpha": true
					};
					this.ctx = this.canvas.getContext("2d", attribs);
				}
				else
				{
					attribs = {
						"alpha": true
					};
					this.ctx = this.canvas.getContext("2d", attribs);
				}
				this.setCtxImageSmoothingEnabled(this.ctx, this.linearSampling);
			}
			this.overlay_canvas = null;
			this.overlay_ctx = null;
		}
		this.tickFunc = function (timestamp) { self.tick(false, timestamp); };
		if (window != window.top && !this.isDomFree && !this.isWinJS && !this.isWindowsPhone8)
		{
			document.addEventListener("mousedown", function () {
				window.focus();
			}, true);
			document.addEventListener("touchstart", function () {
				window.focus();
			}, true);
		}
		if (typeof cr_is_preview !== "undefined")
		{
			if (this.isCocoonJs)
				console.log("[Construct 2] In preview-over-wifi via CocoonJS mode");
			if (window.location.search.indexOf("continuous") > -1)
			{
				cr.logexport("Reloading for continuous preview");
				this.loadFromSlot = "__c2_continuouspreview";
				this.suspendDrawing = true;
			}
			if (this.pauseOnBlur && !this.isMobile)
			{
				jQuery(window).focus(function ()
				{
					self["setSuspended"](false);
				});
				jQuery(window).blur(function ()
				{
					var parent = window.parent;
					if (!parent || !parent.document.hasFocus())
						self["setSuspended"](true);
				});
			}
		}
		window.addEventListener("blur", function () {
			self.onWindowBlur();
		});
		if (!this.isDomFree)
		{
			var unfocusFormControlFunc = function (e) {
				if (cr.isCanvasInputEvent(e) && document["activeElement"] && document["activeElement"] !== document.getElementsByTagName("body")[0] && document["activeElement"].blur)
				{
					try {
						document["activeElement"].blur();
					}
					catch (e) {}
				}
			}
			if (typeof PointerEvent !== "undefined")
			{
				document.addEventListener("pointerdown", unfocusFormControlFunc);
			}
			else if (window.navigator["msPointerEnabled"])
			{
				document.addEventListener("MSPointerDown", unfocusFormControlFunc);
			}
			else
			{
				document.addEventListener("touchstart", unfocusFormControlFunc);
			}
			document.addEventListener("mousedown", unfocusFormControlFunc);
		}
		if (this.fullscreen_mode === 0 && this.isRetina && this.devicePixelRatio > 1)
		{
			this["setSize"](this.original_width, this.original_height, true);
		}
		this.tryLockOrientation();
		this.getready();	// determine things to preload
		this.go();			// run loading screen
		this.extra = {};
		cr.seal(this);
	};
	var webkitRepaintFlag = false;
	Runtime.prototype["setSize"] = function (w, h, force)
	{
		var offx = 0, offy = 0;
		var neww = 0, newh = 0, intscale = 0;
		if (this.lastWindowWidth === w && this.lastWindowHeight === h && !force)
			return;
		this.lastWindowWidth = w;
		this.lastWindowHeight = h;
		var mode = this.fullscreen_mode;
		var orig_aspect, cur_aspect;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || this.isNodeFullscreen) && !this.isCordova;
		if (!isfullscreen && this.fullscreen_mode === 0 && !force)
			return;			// ignore size events when not fullscreen and not using a fullscreen-in-browser mode
		if (isfullscreen && this.fullscreen_scaling > 0)
			mode = this.fullscreen_scaling;
		var dpr = this.devicePixelRatio;
		if (mode >= 4)
		{
			orig_aspect = this.original_width / this.original_height;
			cur_aspect = w / h;
			if (cur_aspect > orig_aspect)
			{
				neww = h * orig_aspect;
				if (mode === 5)	// integer scaling
				{
					intscale = (neww * dpr) / this.original_width;
					if (intscale > 1)
						intscale = Math.floor(intscale);
					else if (intscale < 1)
						intscale = 1 / Math.ceil(1 / intscale);
					neww = this.original_width * intscale / dpr;
					newh = this.original_height * intscale / dpr;
					offx = (w - neww) / 2;
					offy = (h - newh) / 2;
					w = neww;
					h = newh;
				}
				else
				{
					offx = (w - neww) / 2;
					w = neww;
				}
			}
			else
			{
				newh = w / orig_aspect;
				if (mode === 5)	// integer scaling
				{
					intscale = (newh * dpr) / this.original_height;
					if (intscale > 1)
						intscale = Math.floor(intscale);
					else if (intscale < 1)
						intscale = 1 / Math.ceil(1 / intscale);
					neww = this.original_width * intscale / dpr;
					newh = this.original_height * intscale / dpr;
					offx = (w - neww) / 2;
					offy = (h - newh) / 2;
					w = neww;
					h = newh;
				}
				else
				{
					offy = (h - newh) / 2;
					h = newh;
				}
			}
		}
		else if (this.isNWjs && this.isNodeFullscreen && this.fullscreen_mode_set === 0)
		{
			offx = Math.floor((w - this.original_width) / 2);
			offy = Math.floor((h - this.original_height) / 2);
			w = this.original_width;
			h = this.original_height;
		}
		if (mode < 2)
			this.aspect_scale = dpr;
		this.cssWidth = Math.round(w);
		this.cssHeight = Math.round(h);
		this.width = Math.round(w * dpr);
		this.height = Math.round(h * dpr);
		this.redraw = true;
		if (this.wantFullscreenScalingQuality)
		{
			this.draw_width = this.width;
			this.draw_height = this.height;
			this.fullscreenScalingQuality = true;
		}
		else
		{
			if ((this.width < this.original_width && this.height < this.original_height) || mode === 1)
			{
				this.draw_width = this.width;
				this.draw_height = this.height;
				this.fullscreenScalingQuality = true;
			}
			else
			{
				this.draw_width = this.original_width;
				this.draw_height = this.original_height;
				this.fullscreenScalingQuality = false;
				/*var orig_aspect = this.original_width / this.original_height;
				var cur_aspect = this.width / this.height;
				if ((this.fullscreen_mode !== 2 && cur_aspect > orig_aspect) || (this.fullscreen_mode === 2 && cur_aspect < orig_aspect))
					this.aspect_scale = this.height / this.original_height;
				else
					this.aspect_scale = this.width / this.original_width;*/
				if (mode === 2)		// scale inner
				{
					orig_aspect = this.original_width / this.original_height;
					cur_aspect = this.lastWindowWidth / this.lastWindowHeight;
					if (cur_aspect < orig_aspect)
						this.draw_width = this.draw_height * cur_aspect;
					else if (cur_aspect > orig_aspect)
						this.draw_height = this.draw_width / cur_aspect;
				}
				else if (mode === 3)
				{
					orig_aspect = this.original_width / this.original_height;
					cur_aspect = this.lastWindowWidth / this.lastWindowHeight;
					if (cur_aspect > orig_aspect)
						this.draw_width = this.draw_height * cur_aspect;
					else if (cur_aspect < orig_aspect)
						this.draw_height = this.draw_width / cur_aspect;
				}
			}
		}
		if (this.canvasdiv && !this.isDomFree)
		{
			jQuery(this.canvasdiv).css({"width": Math.round(w) + "px",
										"height": Math.round(h) + "px",
										"margin-left": Math.floor(offx) + "px",
										"margin-top": Math.floor(offy) + "px"});
			if (typeof cr_is_preview !== "undefined")
			{
				jQuery("#borderwrap").css({"width": Math.round(w) + "px",
											"height": Math.round(h) + "px"});
			}
		}
		if (this.canvas)
		{
			this.canvas.width = Math.round(w * dpr);
			this.canvas.height = Math.round(h * dpr);
			if (this.isEjecta)
			{
				this.canvas.style.left = Math.floor(offx) + "px";
				this.canvas.style.top = Math.floor(offy) + "px";
				this.canvas.style.width = Math.round(w) + "px";
				this.canvas.style.height = Math.round(h) + "px";
			}
			else if (this.isRetina && !this.isDomFree)
			{
				this.canvas.style.width = Math.round(w) + "px";
				this.canvas.style.height = Math.round(h) + "px";
			}
		}
		if (this.overlay_canvas)
		{
			this.overlay_canvas.width = Math.round(w * dpr);
			this.overlay_canvas.height = Math.round(h * dpr);
			this.overlay_canvas.style.width = this.cssWidth + "px";
			this.overlay_canvas.style.height = this.cssHeight + "px";
		}
		if (this.glwrap)
		{
			this.glwrap.setSize(Math.round(w * dpr), Math.round(h * dpr));
		}
		if (this.isDirectCanvas && this.ctx)
		{
			this.ctx.width = Math.round(w);
			this.ctx.height = Math.round(h);
		}
		if (this.ctx)
		{
			this.setCtxImageSmoothingEnabled(this.ctx, this.linearSampling);
		}
		this.tryLockOrientation();
		if (this.isiPhone && !this.isCordova)
		{
			window.scrollTo(0, 0);
		}
	};
	Runtime.prototype.tryLockOrientation = function ()
	{
		if (!this.autoLockOrientation || this.orientations === 0)
			return;
		var orientation = "portrait";
		if (this.orientations === 2)
			orientation = "landscape";
		try {
			if (screen["orientation"] && screen["orientation"]["lock"])
				screen["orientation"]["lock"](orientation).catch(function(){});
			else if (screen["lockOrientation"])
				screen["lockOrientation"](orientation);
			else if (screen["webkitLockOrientation"])
				screen["webkitLockOrientation"](orientation);
			else if (screen["mozLockOrientation"])
				screen["mozLockOrientation"](orientation);
			else if (screen["msLockOrientation"])
				screen["msLockOrientation"](orientation);
		}
		catch (e)
		{
			if (console && console.warn)
				console.warn("Failed to lock orientation: ", e);
		}
	};
	Runtime.prototype.onContextLost = function ()
	{
		this.glwrap.contextLost();
		this.is_WebGL_context_lost = true;
		var i, len, t;
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			t = this.types_by_index[i];
			if (t.onLostWebGLContext)
				t.onLostWebGLContext();
		}
	};
	Runtime.prototype.onContextRestored = function ()
	{
		this.is_WebGL_context_lost = false;
		var i, len, t;
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			t = this.types_by_index[i];
			if (t.onRestoreWebGLContext)
				t.onRestoreWebGLContext();
		}
	};
	Runtime.prototype.positionOverlayCanvas = function()
	{
		if (this.isDomFree)
			return;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || document["fullScreen"] || !!document["msFullscreenElement"] || this.isNodeFullscreen) && !this.isCordova;
		var overlay_position = isfullscreen ? jQuery(this.canvas).offset() : jQuery(this.canvas).position();
		overlay_position.position = "absolute";
		jQuery(this.overlay_canvas).css(overlay_position);
	};
	var caf = window["cancelAnimationFrame"] ||
	  window["mozCancelAnimationFrame"]    ||
	  window["webkitCancelAnimationFrame"] ||
	  window["msCancelAnimationFrame"]     ||
	  window["oCancelAnimationFrame"];
	Runtime.prototype["setSuspended"] = function (s)
	{
		var i, len;
		var self = this;
		if (s && !this.isSuspended)
		{
			cr.logexport("[Construct 2] Suspending");
			this.isSuspended = true;			// next tick will be last
			if (this.raf_id !== -1 && caf)		// note: CocoonJS does not implement cancelAnimationFrame
				caf(this.raf_id);
			if (this.timeout_id !== -1)
				clearTimeout(this.timeout_id);
			for (i = 0, len = this.suspend_events.length; i < len; i++)
				this.suspend_events[i](true);
		}
		else if (!s && this.isSuspended)
		{
			cr.logexport("[Construct 2] Resuming");
			this.isSuspended = false;
			this.last_tick_time = cr.performance_now();	// ensure first tick is a zero-dt one
			this.last_fps_time = cr.performance_now();	// reset FPS counter
			this.framecount = 0;
			this.logictime = 0;
			for (i = 0, len = this.suspend_events.length; i < len; i++)
				this.suspend_events[i](false);
			this.tick(false);						// kick off runtime again
		}
	};
	Runtime.prototype.addSuspendCallback = function (f)
	{
		this.suspend_events.push(f);
	};
	Runtime.prototype.GetObjectReference = function (i)
	{
;
		return this.objectRefTable[i];
	};
	Runtime.prototype.loadProject = function (data_response)
	{
;
		if (!data_response || !data_response["project"])
			cr.logerror("Project model unavailable");
		var pm = data_response["project"];
		this.name = pm[0];
		this.first_layout = pm[1];
		this.fullscreen_mode = pm[12];	// 0 = off, 1 = crop, 2 = scale inner, 3 = scale outer, 4 = letterbox scale, 5 = integer letterbox scale
		this.fullscreen_mode_set = pm[12];
		this.original_width = pm[10];
		this.original_height = pm[11];
		this.parallax_x_origin = this.original_width / 2;
		this.parallax_y_origin = this.original_height / 2;
		if (this.isDomFree && !this.isEjecta && (pm[12] >= 4 || pm[12] === 0))
		{
			cr.logexport("[Construct 2] Letterbox scale fullscreen modes are not supported on this platform - falling back to 'Scale outer'");
			this.fullscreen_mode = 3;
			this.fullscreen_mode_set = 3;
		}
		this.uses_loader_layout = pm[18];
		this.loaderstyle = pm[19];
		if (this.loaderstyle === 0)
		{
			var loaderImage = new Image();
			loaderImage.crossOrigin = "anonymous";
			this.setImageSrc(loaderImage, "loading-logo.png");
			this.loaderlogos = {
				logo: loaderImage
			};
		}
		else if (this.loaderstyle === 4)	// c2 splash
		{
			var loaderC2logo_1024 = new Image();
			loaderC2logo_1024.src = "data:image/png;base64,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";
			var loaderC2logo_512 = new Image();
			loaderC2logo_512.src = "data:image/png;base64,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";
			var loaderC2logo_256 = new Image();
			loaderC2logo_256.src = "data:image/png;base64,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";
			var loaderC2logo_128 = new Image();
			loaderC2logo_128.src = "data:image/png;base64,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";
			var loaderPowered_1024 = new Image();
			loaderPowered_1024.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAEACAMAAAAa+/QWAAABnlBMVEUzMzOIj4M0NDSGjYGIj4I1NTSCiX02NjZrcGeHjoKBiHxLTUk9Pjw3NzZeYls6OzpTVlFSVVBuc2qFi39tcmljaGCDin6Ei3+Ahnt6gHU4OTg7PDs1NjV7gneEi345Ojl/hnp5f3RHSUaFjIBDREI/QT5PUU04ODc/QD5+hHllaWF8g3d3fHJvdGtJS0h9g3hOUUyHjoFMT0tpbmVma2KGjIBBQkBbX1hWWVNzeG5gZF1HSUVJS0ddYVpQU05XWlV2e3Fxdm1yeG5jZ1+Bh3tobGRNT0t4fnNFRkNxd21/hXpbXlh0enBfY1x7gXZobWR6gXY6OjlUV1JUV1F3fXNwdWxiZl5GSEVBQ0A8PTtRU09kaWFhZV5+hXl1e3FgZFxmamJFR0RcYFlKTEhYW1ViZl9ISkZ2fHJZXVdCREF9hHhna2NVWFI+Pz10eW9DRUJYXFZ4fXNOUExVWVNpbWVZXFZ8gndhZV1scWhkaGByd21qb2ZqbmZRVE9ERkNMTkpAQT9cX1mAh3tzeW9aXldwdmx1enBnbGNPUk1XWlSUKB5gAAAbDklEQVR4Xu3dZXfluLIG4CpvhjAzMzM1MjMzM8Mw85x/fde61kp1EgucbPukT97n66RT3bPtd8tSSaYgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUHZEKdImpY4offRlAYB5Vr6iTapgpZwAAAEAAAgAAEAAAAACYAcAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQADYQGaASqiZvmCpMiqdskzMlVNvKxfufne47tbJqvuZWAOgOL23vG745cHyZ3uee/RlgNT4g+y+EzXMnGxoPFpdvitFm+et/Dlzaihdw8w96aE7P/42nqIvSPNPB8fa0gnmZEP+aO2Vn1q2lIE3hg9MtDNzrvNU3f14KqcmD5+ZYpE7d/ZGaywB8HP5UpoF1/y9/DNtIzBQ6/uHBGUuXm7gddqr93ibq7B4uZ3Xm1s62UIWlbXKCjko1PpayMFXtYr9aiyWP53itZJd38yTXa3yixRIVS4lWPCBrVe267uX5o3af7gfdQB0PGjjAOdOlpHOg1qlnMLYU6s8JthccqdJwvxgmgM17s5QWFezPRxs6q9pMupn5SY5qGXfO3LwNfsSzWRW2J/jIMk/jpDNhpvKe3eC16reamW719kp1jhwP8oAGLjVwBrp3a0UbC8rPc0UwilWrtDmIAAaSMksN7BW40cK5eoBNunqJ4NMD/uayC5VL1+qVkVW/iaj7lOsd6o7ZAD83MXr1UZTWXi7a1gvd3ggsgCo+p0NJgoUqKyGlUfkrphkX3KeYJPJTb7xF2y0VCRnLdkkW7x5TnoH2JdsIasjrCTKyGqv05R1heWvn/yhI0wAPJrjDbKRVBaDo2x2+0k0ATDwLZslb6YoSJaVfeTuASujtFkIgAwRkbecY4v0EXJ0Ic12ibse6fzJykey+sQKV7o/LnAv6fXn2aZz3CUAfiMi8oY5wNkoKotCmm0S76IIgF/b2Orv8xTgISvJPnJ2lJVntFkIgAoiKrvMdlN7yUUmy272FUmjT0bKVr9ziB/Os2+ItLzv2EHiEel9fkt4WQ5yOILKoirB69Xk8w1JXqOu9AFwdV2CJdob6xO8XluRAkywcotc/cpK4jxtFgKgj2jgKYtEV/Vw+cKz8oPZow281m9kV2ziNRpGZx4s/nTkp8WFs0/reY18N2m0se8Q2TyRSvUpsjgmX8A6A9/z53pOHV6o7D9Stffg2G1e465bAAxzoLrSVxZVUyw4eWn5xq/+dEnfh/LjNVJittQBcLVeyo6c3btS4X8jrOw928ifG2mhje6ypLOjZVYu06YhAHpp4L08Gt4spKSAV5hd+8ktkk1vIwtOn/2QIv3vq5mkQHLbHCOL71gcIYvdrPSTxvkuFjXZ6VYSvac7NQmgD4BHLNpPffeu/0l39/S/fw5XlbyyKCRYNJZfpzUylTLNeLq0AdCXZyVfN09rdWcTLI6W0QbFHCvj5OgMKzdo0xAA3d4BVk598Ggd78IQi6kCmfXmWXR+laH1vItnWCQ0CfCLc3/p1yw+kTBOLvZkdPd/E6+q/6Z541/+Nou99gA4lmAlUTspYRJBZfE6zasS5Rna6OpxVqpKGQBlZ9iXXwiq+usByyrIEis/kJufWUmnaNMQAL8Ms+9cgYK0HpTs5nyRTAY7eVXicYaCeCfreVXiIQVJtbPvDZk9Z8G/k1mqxrJimHlqm2/PPM5Jej2xBMDp1Dn2JWavk4igskhd4lVHeylYfyOrIVgJA0DN/ycPd1CwV+3MhsW+SlbqM+Skzv5EZ4cAeKmWhq9oY3TlBK/6ngzKmnjVmV7SaVniVel5CjLmuLZ3mj/XTUYFVv6kYNUOSx4FmXU80WwOgLpy9t2ZJxFZZXmUVrKtpHNeDQI6SxcAd9Td+y9p9cowpqaP1mtNs3KRnAyx8oQ2BwEg2idJ73oTr3plWWVTvi0jPW85Kf2hgXH/iJVJMnofMLWmdZCVQcsUATcNklbfCCv8ozkAZvxJ1OQtj0QklcVzGa7NkoH3D4stB4Do7CWD4ojpm+SwNEq72MXKBG0VAiB9lRyfUPNlpPOIV91yX6iaCYycJPteOnWCqRFtmy0tjD/WPcVK03kyaJlgJdltDAC/oXHqIomIKov9ll4jURdFAJzoI6OiTAJP03r3WcldJwcvWVmmLUIA1Fwls+udMnVMGoOyavgN2fTLUtUHCtAUcLNqO4byM+y7RgbNOeMWg8wIK2fOk9F8mpWjniYARLKKNCKoTOPSbZ0ii2zpA6C9lyx2TbHyXv+h826y8w5J59DWIACS/eT+wdV3ULDjHGYad5EVHsqYhutFMvjDr3d80WXRoIqVAgV5zEp+kCwmk6z8RAEMvRMRV6Z9rLTPk01rV8kD4F8S1lmbPbTebxxiE8i09A5vEQLgZpimC1627OHjfSlyMGtc197lsjekOaH+RvPsu0QGn4wNQ4MJ9iULZPUPmwoatv1FXHmFFV4gu2uJEgfAWbLzmvQbsioSmv4P4wDmHW0NAqCtlexSE6x0ehTAO8NKfZFctDax0lBBG3hphzvoFfsKqiGYk6bSE+wbM19Pw2TXnDeNJlikK0gjksrfstLmlMHLpQ2A35vJTno8kr3axR+eJZtUmn1zzbQ1CIACuejXjN1kFVf5SG7uJ1ipM6wopD3SGlv9kcP2TSGDxjaa3hz7TmTIwSNTR4u+ZSfiyi0J+YhctI6ULgDcP/glVv7RX2N5jyz2sOT5liAAxsJuvdpvmrXjO+RqmJX6gBC/wMoK6bSqxp6sPBAu2e+cZItxBbOKXKQ62VdTZgqAMx5pRFJ5gZU2j5zsKWUAnHMs+ov+LvcOOc8mVJt+0g4qdCMx+yTaXJnhmT25Qq460obLryJnXeTZIyMSLy8n/ViumKMU4HpC81+tK/evTAFwgTSiqbxPBh6OukoYABfJURMrD/VbO8ZIGA8QyadoSxAA+8mRd8LwXZWVWS935Wy4+EfNk7xSs6ZV6htuubTp8Khl+ae5qUjo/72smy2JuHJLTgYHjm6ULgA6PQobYbP61u5EB5nIAPElQVznudfpHz+baxzaMg1/6pj+zkgMUDAvL5FDk7b8uW/qF/Ya2TfhkRNZ9MzTBtp2qIgrv9N8PvG8F+C78Ad5jehi355I++UJMS4IgF79rpuPsjoVxj+Gq+e+ba9nQcbZcjRge6tltJH3TGvKd8nVO312scJ9pBFN5VpWftrmLwa5xEqLfo5zlEw6EtIoBrF9cBPaZvpq47K9fUPnOcNZP2fNjQSJ5jUrYJPmniH+lgL8wL5ckVwN6lfcde0sUVc+IWOm7R0AjyWptIPC5LzTWshpig8C4Kxuwcer3+TZTG2Ghr+sZa/HkOwqkadZnrGcNFxJhqx5Su6GtD33rNwjjUgqSzA8pe0dALIOcM/QyvDY5Tjw5GuKDwLghq7lq8DKcQrnluECrDKPpI+tHXNk1FfHIY+CTJsml45JGLob005g6tobIq5cycp32z0AMjltM6BcSrdJr0V+QYwQAC26tf5yGZWG023YuzaQYN8zU3bkWtY9heyiIN+Z1hQWDHOR1o33Na4BEHFlCdOqbR4AMvBrNO3yLzj8b9tLEOcH16mZBRxjpZfC8doNz8unjEc+Nq3LogvGjQ1d+riT7KinEC6y0uIYAFFXrmZlcNsHQC0rA7TBN6xk7bOIPQMUJwTAcc0HN6RZmXL/jYlW/XpxvWeYClsgpaxH1pY2OJ9j31sKMMK+N5savNx3DICoK59hXwNt+wBYNqzJvk6yrz1DGoNJWe+MEwJgOHj1tTkpnbghXTFcCs9ZGde/FCY5uGFpuNfQxXiCArTmrHesIYF4j1sARF65nn3ntn8AfDQ9rbxh5aN1S/EkxQoB8Cz40jsm+9nCqjJdCkOG5j11BF2XFFg0rKj/yL5PxrvgPxRCMyuP3AIg6soZVvZv/wDYxcpJU5PfH7Ze4rxHsUIAHAmefNkj13FY11jZbVh2vKTfKnB3Y3PIUUOU7DH+q55QGHIROwVA1JX7WPln+wfAazZEe6be0hvRK6uI8UIAHAvuWzspE7dhtbIya9iBnOvQvubzOYklzaEAcnPMaU4g3ZJytwCIuvI4K7e2fwBkjIebfrJkymNZOokXAqAYvAXjICvzFFqafWOm7p0qXS94Gwl6px1XfmWco7jCW7LsFACRV+5n5eT2DwDqMc3idbNyhgK9kMmOeCEAvOBOoMOsZCi0NtNR0AeCvyhkyv9gUHvIG23rzAIFucdbUucUAJFXrmTl4hcQAL8bG8fOGHf6rGgqQgzJXRPYUT/DviSFN2o6R+Skriusin1X6XOnNIcCeGljT+HZOAIg8soXWan8AgKg0RT7tNs4nTErUwRxQwA0BA7damUFOrQ7pt1ffaxcC+4Y7wxuEHul+c74mgJ9G0MARF/5K1b6v4AAGDHFvhxtlk4ZNlC/odghANLs+yuwBy18AMgo/4zxAWEh+ETIl8Ebzcc068b3zH1p8QdAbRQBcOQLCIA286bfvwxbwQuWNgGIf+hWW4IAaDM+JB8P3tpTCG4RrWkN7ime/jICAAFww3Ay2Iwce/Q/DgEgd3pDij53WNMIsjvwoMiMGlG2p8wB0Fi5KT+7BEA0lf9XAyCV124vT6VlGip2CIB29lWXLACW2Ndlfk94IWhT0g8BcwYB/+GDbCoyBkAbbZI9AGKovMhK1RcQAJ2W14AOa9c0+yXntgtMAmbZN0fhjZoHg5eDbqYVbSt4lwwNNl5NjywBcCK6AIihcuWXuQpgafZ7r5s3bfQofgiABPtmglezKLwu86XwKGiAcFB7/t9d9j0MaB1PXre8mudQdAEQQ+Ub0o+9/QPA+t6no5r1n0yD7PqOHQKgjJWzwQO2CgptyLSFRSb2kxUkzmivnucB8/0VSckQ42p8Q2QBEEflAiu7v4AASNr2/D/TpGgVK28pfgiAvuB+89OyQT20Ocul0MS+Cxuv2ip9E9mLgA6Zg7bjzpOtUQVAHJXfsnJz+wdAi3X7aEdP8OsGLlsPXIX4t3F+lF3CYZ23bWE5KJO+6w4g6ykzbBR5u3Gc/cT6ooprUQVAHJWbWclu+wCQsHpgXyGdJkHNc/IH44cAqAw+z7lg/TztkfLI8gO/b1jt3286aHx5w2nZac96JsGRqAIghsoyltq3/QPghr2ZZ5qVb4OWOqauU/wQADLWHw/e3p0lR+6r1156/Xf69aRpsuvF+gf+eevxUSuSX9EEQDyVJ9jXuP0D4IF9/7h3IqjhZ0kzZRwPBEA2+DhKr0a3mO++HaZoGwvulswwvYLg5vqjwv60vjWwg5XaiAIgnsrH2ZfLbPcAkE+9wmGr9GLAJoELFD8EgCzOpGmtp+xLlG12FTBPOq/Yt7TuW+CU+cTMhXXTRrkO+6r0SEQBEE/l71gZ3/YB8FSuI62+pGz6kTCX80LjhwBIzWnO6Jrd7LNsR85ynKgc/tWjPvTmhPnci861+eDV21+XM8a+ZDGSAIip8iIrC9s8AGTEOBry7T/7NI+a8UAA3Nc967+yXPP2WbDH9l7BD3JmpOmWebn2CeGJw0vkyuU2iCIAYqrcy0rtdg+At6x8cgq0uxuOAy/QfwMC4Dfd5dKieeGz+4b4gv0Q+eE1e4/f2xpiFuVP286PG2fl+0gCIK7KafYd2uYBINfRKzLItLPv6/Wrpic8+m9AABxgpVfbufkzhdHazr76lH3ccUb+iCm3vENrtv7ccZga9/LsS1yPIABiq3xZPoTtHQDHWXlNJj+y0i0TRpKssUMAtNZo525usXJzc08A1WRw6PNB/6T5/FHZMF6TISIqS8ipgnpZScMIAiCuygus3N3eAZCpYV+nY4/I2XVHyPdShBAA9tv1sv5F/+kMhXDH6XSX7Oe7XH60ngg7LafJSF7cIJN+Voa8CAIgrsp9rLRt7wC4wMoMmX3NvnTrmm+Zo/RfgQDYLyuzG3QZriT7pGJ9xiV4amWAz1dIy0vLTCXNOq1Ppg6xshhBAMRWuSv0noy3pQuAanL1PSuTrlOkVWsOElygEkIALJOj6wk5pkXf0fciRc6qZYxn0pyQXoFxhzm9rPT+0jl5y5TTAf0TXgQBEFfl06E7MmdLFwC5XnIzn2M5ocmoOCVHUMrXRaKCtg4qQl94N5n1LTjNNeHfS7GLHb+x/pZDwIfVgJkM/mXfuCxP/EZmxQQrCxEEQFyVB3PsSxTJya+J0gUAXyY3M+4xdVzuebn+jlMpIQD4ETlpbjcu3syykj5Pbrz3rPztOBTcvbo7eNZlbeEb2Qo873w8Z0MxggCIq/JfrJx1/flSBYB7F9jgHCvd7rNOC9LhxVVUUgiAfAe5GGaZkglQ7Anbh7Lb+crpZV81nU+6dLvWro5UZl3bE3pzrBzwyNGASwDEWvkIK7lj5KCSSxoAQwOhnvuayCqVlk0mD9lX30olgwBwv2OfJywrfTc53Lup3ibkkcLmtrqP6YZqdfFcvjhqUmrnML8MMTDl0+Tmefq0Zw+AWCvTOVb2eWTVV1/aAOBsmBdM816yeykrf4flNXGlggBwn4BOjbLSU6RAHXlW2ntd6r9gJXffdfdYrmxW1o8cFpp3peacB6ct9azk+slFywvm7yusARBrZepn97ndsi4ucQDwM7JpyYeZe5Ll5ZteXo57LDEEwNwusjnICg9bl3f5dpFsWu+wwofdV8sL6pr94NYTd7db3ioQ4lXdcw/J7nwTM3PnLlsAxFJZ7GMl9wuZpf7ikgfAVJWt6B8hx4ld7GucZN8QlRwCgOuvkllVkpWGCnufAI/YEqB1TNJigKwyc+qOzgU0DuuzaEk1ne8PtzzN7QWyaVGzkYmT5gCIp7J4knT8TDNjXPoA4IQ5AbwsK9zlkYuTrLSx7wqVHgKA68fJZDLBDmfXtByS+aBrZNJxSr40doXYhdApp0S5dA60V4e5uq//LtfxBTK79oKVcnMAxFRZHJZUf2IqOcpRBAAny0kvJfd/rpucdCR4rXmKAAKAE6Yr4KJ8Ckc90nsoP9d+kfSu3mYJFOc2d1HluoA8F2qz/bjEXPKluTexXWbuzQEQU2VRNsEK93wknf68GlmXLgDesO94kTRaJPb5YKhmMXGJSgwBkGffX68pWOYer+p5Tib/YZGtoGCpcskJzoZqc5ejQSz2suAmcnQhKUXaxkmnKBflRId5DiC2yuJ+D6+6HBx9vWPsS4z3lCwAPhxnX315cIRdSPOqSylyNMlrPKMSQwCcvsO+mroOClAYYXHB2rIj0n+mKMDkCIvjKXLzNYvLZHU+waKOXP3Jgqvng3/1lQZpoZi3rALEV1lcYFG/vDEnHtZOSQ9YQ8kCYLy5jZVD32wMnvFTLA4VyZXXyEK60EsHm4HOt7FSM7OL1vKmD7Dgx2RzlwV3ni7SWgOL71nwUoYc3WPxkez+YDFOzp4lWeS+n/RoLa+Q7dHMnWoCIM7KksKipvqCZAA198+ekDLLRI0lC4BuKsqvzp3afcyTq+j+lTMsuOYquTvImuwvEQQAFUd4VWf2PysZlb3XKmcO8eeyHll9NcWCk02P9/xKvpbp3W8S/LlvU+RqmlclmsnuGSuaFwIYpztEuvpd9wD5ikd+21/PgvNXrZ2AcVYW3/BajUvZw3V1h2tPdaqUkWMDTpQsAK4RDY6w4ETT/h/u1d38VN3Vw2vUPKQQ5pMsfqLSQwBQxSivkR5pO/p1Y4LX+eSRgw9pXifRONLV1lnP6+TKyV2qXYYN5KAlF6rRUXR38jrJ/NC5ponGHl7n62vWVuB4K4uTObZKPJIX9ZciAOaJqGIfm0l6uZPfyekURQABQJkZtkreJTeD+9hF4y+bO++Kn4W8bD6GTMYxdlLdTNYAiLmymEyzRaf/NdxUigCQI/5T95Js0fWaNOwTumcpIjgQpCrNZul+cuWdbGeb5EwHhfKIlWRLuIXDXAWFVPU7W+UvuuwGjLuyKP7BRlk1MTBasgBQv3D6NpvkbqYopDKZ+txFEUEAUMVMjg2qWyiE6zNTbHRnhUIqJtn3lJy8TsrZ82ENXGlgo57hDnIIgAgr231sZK2jD0l5U7IAICWz3MBaT1covCwrExQhHAnWWzvFGqMFCunXTzWskzxQoPCaQr7+/r1MdYdXcSvPWunhott5AFFWtitb6OQgyTeTUu5AqQJg6vN/gmYgM7qHNuOhrFpECmcCvv5mgjdKXJ6mTeh4ti/JASYez9Nm1LGvj9yUm04bsktd3J/gAInjrzKuB4JEW9nOu1HdzmtNXTrdR4L2nvWN0yaVnfXdW1N4MtvI69yePUab05pQydVH0UAAiOcLY0NJXpUcql08v/kar2aa5ljkJqoXrtEmZSr+33lylKrw0aaV7bk3mmbB9XeG/y0jqwqlLPLKdqldD7L72hrrGxoOnXvzw+7pAYrL/MW66ksv0g0N+aGm718uztOmVcl7z6ODABCZt/2Lv5WXn1ysWmmmrfL6CpV7T5Y/+Kqy/22Gvjwdu6r+c7K8fGHvnicV26DyTvSXPKbEAAEQPwB7W/dcB+00CACAk+wbox0HAQBwiX17aKdBAABc27ltwAgAgMfs+4d2HAQAwG32rdDOggAAkDbANtpxEAAAP8rhBTsMAgBgQO0sSr6mnQYBAPCVvD92p0EAAHSxb5F2GgQAwBH21Wdop0EAAIzu2CYABADAv+xLXqMdBgEAUHabfftpp0IAAHoAuEA7DAIA4E9WRmmHQQAA7E2ycoR2FAQAQOvwDn0hIAIAwLsxwgq3D9L/PAQAQBn5WsevDLH4SP/7EAAAtYkX75cOjA7lWOyQ9wEiAABqOcBSinYoBAAgAP7O0A6FAAAEwLettDMhAAAB0POOdigEACAALvdRZKCsTinQtgMIgER1N+0cAFA2XV57qbGmIf/iwGzVAIUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8HwP5ibq4RoqYAAAAASUVORK5CYII=";
			var loaderPowered_512 = new Image();
			loaderPowered_512.src = "data:image/png;base64,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";
			var loaderPowered_256 = new Image();
			loaderPowered_256.src = "data:image/png;base64,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";
			var loaderPowered_128 = new Image();
			loaderPowered_128.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAMAAADt/IAXAAACEFBMVEUzMzN9g3g0NDR7gXdzeG9CQ0E1NTWBh3w6OzpvdGx9g3k6OjlkaGFLTUqEi394fXRvdGt1enE2NjZ3fXM9Pj1iZl+AhntVWFNjZ2BWWVQ4OTh1e3FwdWxpbmZAQT83Nzc4ODdrcGhuc2tMTkpKTElNT0tRVE9aXVdPUU1PUk42NzZ6gHZLTUk7PDs5OjldYFp0eXB+hHlYW1Z0enBeYlx+hHp5f3WAh3w2NjVtcmpqb2dMTktISkd/hntHSUY4ODhmamNdYVtnbGRBQkA3ODdyd25yeG88PTs7OzpQUk5ERkNZXFdhZV5eYVuCiX03NzY1NjVOUU2Din5ERUM/QD9uc2pma2N+hXpUV1JFR0Q0NTRDREKIj4OCiH1XWlVGSEVfY1w9Pjw+Pz0/QD6Ein92fHI7PDpdYVp8gniFjIA8PTyAhnxgY11gZF5FRkRQU05YXFZna2NCREFSVVFAQkB/hXpXW1Vrb2dJSkc9PTxlamKFi4BISUZZXVeHjoJzeW9gZF1TVlFfYlxna2RVV1JcX1lbX1lNUEyDiX5tcmlzeXB8gndRVFBOUExpbWZSVFBNT0xhZF5laWJ4fXNwdW1RU09bXllDRUJqbmZfY12Ei4BUVlJbXlhKTEhTVVFcYFpeYltxdm1xd25obGU1NTSFjIFKS0iBiHxscWl9hHlscGhpbWVaXVhvc2ttcWk0NDPL7ZluAAAChElEQVR4Xu3SU6+kWRxG8fWibNvHtm3bdtu27bFtfsXJ6a5UMkklXdU5yZlMat09++Kf38Xmf1mmTJnmnwOAuN3FvpT1fhyw5OVdygBETYlekvStAEUfCKYDBXD+KTAWVQOxduDDMu13WcCx1dLCNpifFrZXRCBoXi4fyk4AggGnKqCmxOwFaDyaImBJ7td1TleK4KlubA1GfHXkdAOx658DnwzCbctAONb8AGTTewN2DOXZrYs+B/TVfhEadUkJgK9RqWszLWBxAfhXUgV8CYxpsyneUgBizx/orhTAqYYocOQsCqcXiEkgRwDluVVAPXGYow0AHyUARYBY089cJaA7pE4V4AV4pcejAeClCSwGxNk+VQiFAMccAKKxFzkfMNgA0ORge5bkDwy3ETZugidKWoC5KO5PAbB/Bl+7afETyWNQD/VP5N1+/Bh5HKhQvZ5HTqJaTAL4SgO/fwOP89MD3DKjrwKg9xBMFuK4S34AvwHM9xSvs74B5Na/mTpUp5MAzmigScvhkbr0AO0z5F4A4KIENF+S1ISaR1VWuFxFvNeAE2XEs2UnAZTOAMLVazOkDNgEsOUQnFADBIaADscNoH7YDBSVWwGUcUCJURGfN78HcCUAxwFMJ4DSO7aW1AHyBgtr0hi4LXaU96t1QJ6xAnjx0APwyF+M6Po2DqDi4CQ0FXrZUXl+EPMOJgC+FkLuGiWwbhRIHfBTpTDSvQGIudXan39ZBwj/age8WjuAcs0p1DbsQMQAwAtp1ll2HFDIxtqOpt/igJqpP5e3/ioGoKcqDYCXOivxukSSFv73e4HyLVeFqbQAe16Whf0EdI5rDaTc33ore9wBzTj/0TJlyvQPsTd0lRaZaakAAAAASUVORK5CYII=";
			var loaderWebsite_1024 = new Image();
			loaderWebsite_1024.src = "data:image/png;base64,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";
			var loaderWebsite_512 = new Image();
			loaderWebsite_512.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAACACAYAAAB9V9ELAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAQTAAAEEwBtcvjBAAAHQ1JREFUeNrtnWd73DbWhv2fHEuW3Ivk3iWruvciF7nbcreT7GZ33588Lx8q44BnQBIgwRl7dH+4r90kGpIgUR6chm3bt2/vAQAAwNZiGy8BAAAAAQAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAACAAAAAAAAEAAAAACAAAAABAAAAAAAACAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAAABAAAAgAAAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAAIAABoz+mzJ3tPXjzsPX/7pHf5+mpvYnKC9wKAAACAcebk6eO9P//va4G19Xu8GwAEAACMM4+ePxgQAGJ6eor3A4AAAIBxZf3VI68A2LN3N+8HAAEAAOPKwsr8wOL/+sMz3g0AAgAAxpnfftveu3Jjtffp93e9b399zIMB9+7bw7sBQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAAIAIAh57//1jt0+GDv3NyZ3tKlhd6layu9qzcu9S5dXe4trsz3zpw71dt/YN9Inuvw7KHehfmzvZXLi/nhPMrTX72y1JtbON87cmy2NzGx49d85zt+y59/fvFC/p6vZO97JWvXmfOnezt3Tia5x+49u7LrneotZ9/0Svbu9P4uLs/1Ds8canHN3b1TZ0/0Fpbnfzy3+ovucT7rP/peatuvPB527ZrunTzzTxv7Y2Fp9WI+FvbsHU1tiIOHDuRjVO96892v5n3m4tJc78SpY72pn6RktZ5D709zhzuXLCzrOY/3pqZ2tr6H5qvzf88L/b6t/695YfboTG/Hjh3NBcDt+zd67z6//MHdtVvJXs6DJ3cL1967f2+S66pjutd9++nlwItWB3L/RmjAprj/0Wwyc697/faVZO/s2etHhWuvXl3yDo5xbVtXHD1+pHdv7Xbvy7/ee0vgWj798a5358GNbOGa6fS5jp040rv/+E7v678/1D7T9/98ygv2nL1wOnrQ+7B96NiJo8G/1YLh/lbvyv6NygrfvHut8p2fnzsb/HyaCO3fnM1ExMt3T0uvv/HlddQ7kfi7evNy9rtXQf1ERZQePbufz0kScb/Coq9FazlbQN58fB7UxvdfX/eu3brc25do/i5Di5n60ec/N+qf639feq/fP8tFfCoxoP7l9rcXWb/y/d2OTIhfuHguP0Xzj+w5qp5T//35myf5Ah7TPw4ePtC7ee9a7/MfG0F98OHTu/kcFy0AFlcuFieZ7GIpJpfpXVMDL0eqMsWHuvfoduG66si+HZWdeFItODfuXC1cV/dJMfg1wOzHPX3u5JZqW2pmjhzOB3LIRFeGBnAqgdVHO1NNIE2fSZOydrxtnmHge5wN/x6Xs92O+9unL9cK/127fU1Mde3QAh76fFog3N35s9ePa6+vzUFo/9QkWjehVyGxoVMWf9aFX/O6dqff/v2xUfv0bu6u3cytBimf69DMwd7660eN37v6mXbek5OTrQVI4brZe7J/oznrw7c3jZ5TfVHzUdUz7N27J+uH9xq/i7X1+9naOx0uAKR47UWOnzzW+qPKPDEwkWYTXooOo/Kl7nVlHvL9nXZW7t+9ePs0yf0/fH/reWdHW19Xk6Z7zd//87m0U49z21Kxmk12bSZ0O/lp8mxv6t/eu3Qt3XPJytb0PaYUAFqMy0RkFVX3tH/b3+HIAvbRzAFlvP7wvLYt2pjIupLiewhZPX42a8CBg/uyjdKLJO378uf73Lydwu0lk3aqsaCF+cjRmWQCQH3CFU93Htxs/Yy///dzbsHz3V//vqk4K2wOsvdQVdZ7IAZAytW9wNWbl1p/3Mee40b1oWUZaOsbsteVf9H3tzIv2pff1uc4k+0EfS9dk17bd7ZmlJ9ObCv723FuWwo0CfvaIlO7LEjzmUCV+V39SSJ4ZvZwru61sGnRKBtct+5fb+ULf2CEW+G51m7lQil/rsMHskl7f963ZW688/BmqSn91ftnjcygSQXAm00BcPn6in/RyJ5df3M/e/d3H97KhYssK2Vj1/d8ei/a+fsWf80t2mHJHK/r6xvryON7FS5NLUB3H/on9e9/fcp3YvI5S3jIQiB/uPqK3GTqPxLhZRO27v+zLP5aFL/+60Np35GwlQtD4199Tjty+bUVf/Ly3XqpINYmr+kzSbTKnVV2bc0PEmby9+t59FyzRw/ncQGaj8p24ZoHNV5SCABdq2/yf/xicD17ubGevztZsdRH5C7U884vnu/dzuaJj57NVP+6s0aoKNbB+x5eP9qMl8m+z+Y9ZnMrk/ql+nmZi0BjYXJyIkwAWMX+JkA1133cMkXdptNsuizmg03UOtvcqsuYSc478WWK1as+s4/ddmcoZe1eU+6ZUhfLGLetLReXLnjNhAqcCd0ty1RXdmSuBmsK11V/l6FJpGywukxMTOT93zeZazGNdd2lFgCyFNlr9n2TTXbEgwLgaH4f9999/P1tvlBMNzBLa5L29RNZaEKDtyS6tYvVpG6vlcrl2da87hMpipuoM0e7vnHfYq35p4nLQ/24zH2jRS008FD9tSxWo8k6YwWAyK2tZtw+zt6FLx7FJzDl+/fFNOi5++NVi7l9r4rNC3kPuobmUglWe4+y+K0BASBzjv3xrt3N/TzyTZbtoGQZaNOhbUeUCq/6e6tgb9273ur+bz+Vm9Ha+Ik1GO316qLRx7ltjaOas35rJzy5jA4c2t/oej5lrsk+NiBqyXMdTQLa2TSJTn+18WzgerGWu5QCQDtJxSW4orFqd9/k+SQmbH8PEU5eC9r82YHrK/Br/4FmgW6yCth+J3G3J/tWowz28+2UJViaCDIFftpNhzZgu3bvirrOfY8Q1iLZxNWoBdBn7dNzxgS1lgkAiTh33DcRFlrI33u+g6x9s9nc6IpHWQ2auDFkwbT9T25WZcfUCgCZOL6bgB0NkKYd7/7j24WX5vqVNSiaDlqZUG0jz82drfEDLw0ETzUOZDuwd+Ba7j/L/Nn02tqdxkYvj3PbmnLFWDE0EbQN4HMngR87lYhsGYkdDUa7+LcR2Tt37swXXdvW/RGCIqUAcBcGmR9jF4WQ53PvIUtI83c3mS047wf6e9vgNpnNB+MBro5MAKiPprZK+IRTjLtj7uI5r4WxbYaB0u4GM3k2cktpGwHQt2RrHTt5pnncgywG1kqkmIx3n18V5kVlzqT8NrJmBdUBsD77pj4sLdJfHBOl/KlW8cmf0TSVayCmoOYD+/zaTTub3cUtX14Y+KDNU+QeR/vdx7ltTbEmwVS+WOsOiBGydmzpt4o9aPtMihj+agRxnUWsKwHgBoilyh0vs0YpJa2dG/HiwDwSag6vw1op9D5GUSvAZ3W7lyjF27qM9f5CLFly03wx7itt6Jpa5wZdmIN9UoF7bQRAn4UWgrPK5fRPDNDHbBPW3ir6xsQv+bJgtoX4TZUH3eQBFARh/RBW9d1vOCnbSUcm8CZZA/K5NLm/m06mTu8zsTVZgOUTszEToVG249y26J3d1M5Wi1oVPv92SDvkg7W/U3BVqjYvX1occE+E7nq6EADn584ma1tZcFPbNGWbFtrWLVkIuDs2W5m+OCzWnt0vmtiz3XCKojT9GC8bfBZSL8SXHdLG0uzzudsYkVBxUiUAVL8kVZ2BMgHQNjauyhJiLVvbyvwU9oeavGIf4Na9awOpO5qQXPNHHrjXQBXbgh+hE+kdE+mrSOEmvmXXBNlPe7puOvXS6kJr0fQtohbDOLctRYZIqt2FJpdvplhPSCCjjTKXYJMoStVmTcbWChA6qaYWAK9bBg+HCIAUgs4KUvli0y1C2weCNJuK8saWoX17Bnz1qYNuFbga436U+LCBav3MkbTpjvsH2q45so0ASFkDxJfBIjeA+k2K6/vS+jUHB5UCtkFgTaKdFZXrqs5+sIkt9BBba0B+O/thQ8t82qBEpVzFBsHYPHYprU23xGzrfHyZNIuLePiOZJzbFj34s8U+hYgtFaAb67mA6bNSI0BVutdW+EtRS2Cg4qZJLQyd8FILgJS7Od/zpYgdmZicyL+jxEqfI4l36Lp+sU7JpaEKgJUriwNm9qZxVzELTZX/2rczbRskWpptY2IfNFZDUqR9AmD9ddp0ZV82xWIC94KL3ahYAVoqABRF3KbxytMs879YF4MiN2OurcmpmP7zLko82AAMLW5RH+7lQ29nl3JzzfCbtQ7igols3nnMjmSc25bCBaCa7aMKwjpx+niyGI3qtMc5E5G/PnQBoN3dROJFJiSg6WfETvKxc11qAdJVTQLrBqgKkrNul9TWokKVTU9s1LmAecAnAM4lnj+UuWLvsTtxpoiyWao2Hduq6pLbYKWYQa1yjIUO4eSIKirY3cF/jMwtt6keMcEdeSCa8Q3FRLXni6wTxf1qY73yo8b4c7SgWstGbCToOLctFpu90HXBocrxYAS1AhQ7ERrGzRI6tlIKgJcb68nbZZ/vZy6z6/LI+N+V2z6se096NgTnOhLBdlGfL5kbpqZ9ZeEXOn0PbnR9aNyZTwCkyGYpZCmZNTJmI9vUVX7t1pUwASDTsfVfxQw6V3nI9Gl9vTIhu9eOiby1HzQ2k8BGucdMWCrR6P5WaW3FALFjA4UiQq997sKZ1tH249y2totu6qC7NtkPKQ/asq4GmWT7hFoZfjUBcAIBEJ0pJarKwrZBOeZuvysLMjzlSY9sUv8iBgUl2vK4TQTAdOJzD+y46cISYjeEtj7Mtpg0ltDT4PYfLPqEHnjSkWz6jXK2gwop7Nk9EOk8GVn21vqH80j3qbBo6QdP7lQWsckP53HyijdTxMKez9aXbuIvHOe2RQc0ZgPWVylPZtA2efcpTKRdVj8c9VkACICfQwBYd5DGwqjfx6oJGFTRn67vqbLetv/UZUEgADIumJS90NO0lk2xF98pXzbTQEGHTYpHNA3MsGltVSeRuZWm3ECusvdho/HPBp7UZp8p1n+/FdrWZPD7DhhRMJBcSSFlPNuid9tVSiICAAEQamLu0tfetAS2e3BUZ5kQntNH6yzOCIC/d1B28gwJUnADT6p2ibZ6WUhJWHvy3VLDnZT1Z4fEEZw0gVyXS6wWtgqYqiHGRtK2OXp3nNvWBPk9bfW9QurNl1d5hoLeQRenEsrsOpAPnqjYDAJgCL70rE+o9oPK3yp/fW39Xj6x2gwCH9YCNUwBYCPgn0S47LriuVmQYuO3mqbt2nWszm2MAChZpOdqTleSL8h92VWpXtZSsBSQavjJmFLlbmjyYqwv6kOAX8hWbypLPbS7aU0CdbUOrLlO5vimH32c29amLoCNiC47nUuBMzpWWpN+ijoFvqIfXZ1/gABI5z5ScJqC21IdUTtsAaDz4OtcscPGZgJdDnT9pnbB1Z0SiADoF3kwD6mjO6sn+wvBL9ruDDXYYiqptal3r4wGWwSkKhjFpsHVLaruGQi+Agx1psI2edTj3La2SPnbANQqlDetPq8FsakYmPWUYk1VIhcBkBZ9lzsPbnhP9PvVBIBNQRzmvUPT0oYVlGtdkHUFmRAAJS9CB2dUVSp6+nKtsJuqO5tc0eBuwFpVcJYUeaGOfMvDNdxnravxfMS8h7qASC00hfzfe9d6oRkXmzn2U7StQySIlEtudyRVyPqk3+yMLKPqm0wQAD+fANCi8O2vj5V9QIfVaFKVK1LugKs3L+ftL8NmLA1zEbZzwFYWAPYEvrp6/ggAZ3dozzAuC6DQxOgq55AAPU2oxeIw54M7dNtcYFuRqspHZlPK6oLYtAt3J5OqfGzb2VJMoOPcti7MvUpT1IT++sOzWpOvMiHqTIguOp5zWOlYCIBmPmIb3OpagJSyKdE7NR0vXEcZBPj4+cNODgBqg4KLRyEAPjqn0OYWgJoiZAiAisjNso+mYCtfGdlK3+zhA0ELlcyv7jHFeR35iXb+2X0mOrSqNr17spxb1rjaB3cvKPBL77Pwfq+2HxTj3LZhBH0pjuL2/RuFtEffMcAhbgHvuQQd5z4jAGKCZq95j36V+3Nny0NzRikAHj4tjtGHNe7bYWBjyoZVGtmO4zo3JAKgoojL87dPausGaBelgMDYwj551oAnr//YiaOdnNplTXQK/KrLrVfAXJP3psAyf2Tsk04OnBjntg0LLfCaLN6Zo4VjAqs0DuzvhpUGiQCIKyveP5AlVZDmKAXA7Qc3Oq1l38gt8WptKKWJB9JwjVVPAh8BECgAVDTBNYv6iu9oN+6ahWMmAS0edXnrKhRUDOJIU0feVomSObxuFxvqetA7coPxfLn1OpjDdZt8SlgOcpzbNgohoHflcw/M1/RFudH++F8xqExVFxEAoxUAyl6xwWH655QlX0cpAOwpffK/j7qfWVEyDJegzwJXV/8DAWB48fZJ5QRhU89iTg+0Bzb4dlWvTApXqjry9mx330dwzVYKaIuJBpeloir9y+bfh57ettXbNirUJhshLrfJRI07yp5LsHJlCQEwYgFgT88UsjSOSyEgWa6sW2OY9Tf8gdwXB1yTXT+TfQ8av3XjFQFgWDE5+/ZUK1vqNdaE5ipxuxBZC0TKOvK6zzfnDPU8E8H50BIasYVvqqopWmFkd+mx5xps1baNEjsWQtpmFwLlaCMARisAbFGxujTkX00AHJ45GL3z7Rrf+QRdF8Wya1PI+oEAqClm4p5mJgXnFlp422CBtouFm1tu0858puyUBTPcY2NtNH3sIqbIYXfH+NJMMm4apP5u585J2vaTMzExUSiGtJk6WZ2SumwOadJ46eLZNElJmPUJdTVsRQFgY2S6CFAdpQDIU3BrzoNPaW10+11ZgbZ8U2JSLcvih1K9g09/vCumj9+5igCIFQC+VIr+SWNHj80WqztdW4l+0CPmGu6D2tK2UpEpX5KOriwGpvwzSHWEbLGscfw550+da2zWOtj0MarmQdd1sce5bVWld7VA9Oki4O7Jy4dRQam+c8m72PmcMkFtocWytqIA+GYWx/NzZ8dKAPjcdF2VA7b1NKqi7O2mRNbfrtwAJ4wbMg+GrilchgAIDOCY/zuX8vqt4u5dFfsa5Wo61ejcs5E3HP/pF5WeTdxZdpsTBvvBajpFz93hajA3WoQXL3jfm/VNyT+WugOMc9tCayBoF5T6HrdM6WQNtNpiJCYO4FZFAaVUgV+hE/5WFAA2liN1hUqlEOrci1EKADsOY7KzYlyNtvJolbj1ZV6EHirWthiSNrEh6wcCwPfhzLGKygW3eeRtyvPeNPm42jXZUwMfdJTL+uZjUcGqPoGta3Ch4QSh3bAbw9DfLd41xUe6yg0f57b5d8EnOq+9b/3HIWmptqz2978+FWIy0nzrF8Vgw8uLCICy3HCzOEs8pXxmxUmNshRwLkJ2TmYCuGhy14Yt5T2si1aWlapgYmVfWGuy3DEpzt2oCoLOv3GgdRoBUFIgxVXN+oh2h9mmc9lcf52ZbheqrurI21TEuYXzeU3wQlnjqeYlbN18+M3T8LYXcsvbCKet3DavH3x6aiBdTxUnU97Dpo/VlU/u++ftTknfIWWGgt3t9d10CID6ojQpn1vfwpcyOopyvDa+Sn0wtF+EVIq1h2yFVBy8aKx0qWMBlKZsLW6yBE4HVnNEAJTg+o3zRXp1vvDP8uW3Cdhwyw7LLH3D6bxd1pG3MQhS765lQ+1uc/3F5XmTbnSkUJziZstzDbZq20ILjiizJOQo6yY7npgFU8cO29+eTLCYKVPG1jt/FJFpsBUFgOr4d5EGqLM1ys4UuD+Ewjc+K903YwVQMbcUO26b1rd5kmi9C1j3ttYqze8nawr0hK4jNs4gNjUdAVA22a9cHMgGcP3LVQcFxaZsqHyjm///qsOiEeo0rklww1R+a1t4yKbc2ZO6TnZ4vOmv3Lam5Z6Pnzw2MIC1ME22zERQgKE9WlSHBIVOprq/tR5ocm4TECjLnIIsba5zjNtjKwoAW4a8b61qs8mQhdJaeVKkf7Yte67Db3xVLNvEU6mP2DiKuxHnDeiMDPt7vbtW80U2DvUMA2P/3dOotiIASlB6R1nnvhVYRjbGjOnuJFP76Cw6p97XrjxwJkF1sIKpzGmXzjiYmNhB29zo3VPHfpjwZLq71CCzRLXPbXvfZIOsaTyCdnZuoGrMmRf2Or6Jby7igKE+aovvRMOliN3OVi4FbKP0N6tavog2kUsYuqXQ+9/UmsdflJRR73Ic9E31NiOgb/2LtYxpIfVVxZSwjT0wacHjCtB1Vfk11kKhb+A76luCPfb0TQRARDRz6LnwoQruy78+eK8vxTjMiNnUBUJsLvg/AWQPOzcD/kptkyBRgJy9Vmz8h8zi1szY3x3L0jRz5FDgZHA4L5Lk8+nK2tHE6mWLKP2TLvkoyAythV9ZBL5z65vEFWxVAaCF4atnvtHirXojVac2Sthqw6KddNlO9prJkPoYUQ471ThwsxJ8YlEWKNVAqFvgVP9CdUTeesaU3qFK7jZaCK+veMeCAgN1v7oNhCyQ+lY+y4ue6/DMoehnQgBUcOPu1cEjUhX8tSNNep49fXBYdeRl+vNN8kurC0mub0/oS32uwbi0rUysNDGfyv9pg71sv9LOSBOI/JkqlLK4Mp8PTu3obLRywY/65kkrl4JEgG8B7y8UOs1NO75FPVe2U1JEv4LIbAEbW+SkiSDZyqcBSnBVme1VQ199T6dDSjgq+0nHRpf95vOf7/PaKGU+8tBAtJTjwA2Qlej3XVd9Uf9N2VgS9OpzcvlqbCidriyuQWNE7pRWcUTZfcqO4ZYVUfdXzIbep6wGy9lY0PfwCZof7pxvbxqLEgRAjJk+8alOvjzRYUXPWpOdW/Coi4IZ+bkGQzob/ldpmz1p8Mdxpk+bpYBqB6GFsWyCiSa7jgIpdyRw22ii2SixqMWgeJk2BwxtZQHQL1HrBiA3RWLSNan7AkZDfdypx4EbT5BqPEiMpFoYFay88eVVkjEqq0ysOwIBEDGhfjdq8HTCOu8yNVm1eeb8cOrI20IqKc8dEDK1WX/jsKKBf5W2yXRvA+1SBEoeynYpigso23XXoQlTPuPURxqrv8unas8sD0HmW2UWTE9PJV1gt5oAyK1F2QR/d+1mo4VRvn2fC1QuBJ+VZpTjwA3Cs1ldoSio7sSp9N9A4kS7/E+eWJsQtOApCymFMEcAVKBccjWgz0SDMrJ15lH3+sOqI6/Iafnt+pxKkJZiJwT3+sM8IOdXapueVX53mVpl/kv5rHILyNSvxbzKxN+P8JefXybKVCdQlgqBbAyp7oV2eFUToBYF7bw0RiYTjQv3u4kDh8IDJZVx4f52YXk++buxz5e6sFOhH+/dk4nZ5TzrqEws5gF+79ZzF83Bmncl4d30/XQ5Dn5kQxw6kOfgy1X2+38/lboHtEDJHZBaAJfFgqmstQqK5TFnZe6BvwMtL19fbe2GsLEhts8p2yZtoaLiuFnsoFqq5jn3HlbYbxvW4gPws6IzEBRUJ9Wv3cORYzP5ZKKgqVE+l+6vstoyT+s8A028bXf6EBk9v+O33E125O++oYBQCd1RH6vbZcqw2vtjLGT/KxGSukpfE3HcH6MaDzPZWBjn7zAsEAAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAACAAAAAAAAEAAAAACAAAAABAAAAAAAACAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAACAAAAAAAAEAAAAACAAAAABAAAAAAMDI+X+POfqP7j8eMwAAAABJRU5ErkJggg==";
			var loaderWebsite_256 = new Image();
			loaderWebsite_256.src = "data:image/png;base64,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";
			var loaderWebsite_128 = new Image();
			loaderWebsite_128.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAMAAADt/IAXAAABblBMVEUzMzM2NjY4ODheYlxAQkA/QD58gng0NDQ5Ojl6gHaCiX59hHlMTktZXFc9Pj15f3VkaGFdYVuEi39WWVQ8PTxgZF5FRkRtcmo1NTVlaWJscWl4fnSBiH1xdm5iZmBqb2c9Pjx2fHJcYFpYW1Y6Ozp9g3lHSEZcX1mAhnt+hXo3NzdSVFCHjoJGSEVAQT9CQ0FERUNZXFZobWVERkOAh3xUVlI8PDt1enF3fHNiZl9DREJ2e3I3ODdRVE+FjIE4ODdOUU2Din9KTElVWFNJS0hxdm1MTkpna2RbX1lQUk5XWlV7gXd8gndrcGhuc2tfY11tcml0eXBNUEyDin5yeG9ISkc1NjVmamOEi4BKTEhvdGx6gHVLTUp0enBwdWxNT0x4fXR4fXNVV1M+Pz5aXVhbXlhPUk5vdGs7PDs/QD9pbmZTVVGIj4NXWlRgZF1pbWY5OTlhZV9TVlFlamJzeXB/hntscWg0NDNeYluBiHw6JP9nAAAC8ElEQVR4Xu3R1YpsORhA4bVdyt3dXdvd3e2467jL2w+himloai7m6nCgvos/yWYTFoSv3tTUlFzky/pxhy+rGOQrZ0YM4NsCQEY7cAF80wEGMZTHwKz4gZkthNk7Sz8PA6xclOZmxBqA3stA4gkrb9ZzHviQKiUUibF2Rre8JiDlX+s7u0D4zN3XPUq0GDs6upOB4zKQcwCabbR0QG0qgOKlsgd839wGnq8DSKVK0Zyxu5B/FV4O587A54X+q3hLw5dI3ajsv25JWiTOSGc4YwZDR3WiF3FV3i0VwGldb8uDRCy3YmqRCJBWIGjNdyFwgpHUoJLxAEvPWKwBOxkvrD1aA9h+ChBKE7yaBT755VHAnAH4HBJQVQF51UTgRQHgNEDhuQG0/UGczTaw+Z0TKDaXYXMJDkMVBeINyARgXj3WkDck+F1FdmQd4EwhqLaGwFYEwZUdBbwD8MX4V7KNIK3+BHBzSe4DQqSAMwfwdtUA2NDgdsMkFVY9GMkiNCIELUIu1k+BvQKNGEtdvC4EAsPzgBsILTAyCnCNd8Lgh/jHj6ujADXJ2NVnxpHOOQC3H8EWn08P5BJYWngJMG3jUCF8QSwArD8h/ph3CpbKiOT82ZGRCIX+K8Bn/dJxu+1xwJAx/1uEyq8TArb2Gl5QXJU8wFw5NYBS8TgLLNtyLYrmCercu91RKGQQzOjDgOyGef8EyE0JQFrDs4nQ358QkHXEb2Dxt+sBQN6rA2mfByG10AcS4m7hfQ/g8A/UpAQYQ+1hQMsB4B4/AbkDgLTC2QmAaXcmBOBxGIClI3T9aaBshxBc/ksgbz+DbgPKwzK4PVvQj8vU7855GFBPBgzK848W+bOXhe1aGC6rWWTdFyV4HWNSQD59PyFRBoxEC6GtS4Aq5ntRvjtfdThcQDRU1asLEvQUWHgD0PsLIJy4SqYWXzip114Cu55aNdUBZk/+LtX2DdiMAAQthKdu/q/bOmNrTCZFJx+NZSaYmpqamvoHZD1hKSAldSkAAAAASUVORK5CYII=";
			this.loaderlogos = {
				logo: [loaderC2logo_1024, loaderC2logo_512, loaderC2logo_256, loaderC2logo_128],
				powered: [loaderPowered_1024, loaderPowered_512, loaderPowered_256, loaderPowered_128],
				website: [loaderWebsite_1024, loaderWebsite_512, loaderWebsite_256, loaderWebsite_128]
			};
		}
		this.next_uid = pm[21];
		this.objectRefTable = cr.getObjectRefTable();
		this.system = new cr.system_object(this);
		var i, len, j, lenj, k, lenk, idstr, m, b, t, f, p;
		var plugin, plugin_ctor;
		for (i = 0, len = pm[2].length; i < len; i++)
		{
			m = pm[2][i];
			p = this.GetObjectReference(m[0]);
;
			cr.add_common_aces(m, p.prototype);
			plugin = new p(this);
			plugin.singleglobal = m[1];
			plugin.is_world = m[2];
			plugin.is_rotatable = m[5];
			plugin.must_predraw = m[9];
			if (plugin.onCreate)
				plugin.onCreate();  // opportunity to override default ACEs
			cr.seal(plugin);
			this.plugins.push(plugin);
		}
		this.objectRefTable = cr.getObjectRefTable();
		for (i = 0, len = pm[3].length; i < len; i++)
		{
			m = pm[3][i];
			plugin_ctor = this.GetObjectReference(m[1]);
;
			plugin = null;
			for (j = 0, lenj = this.plugins.length; j < lenj; j++)
			{
				if (this.plugins[j] instanceof plugin_ctor)
				{
					plugin = this.plugins[j];
					break;
				}
			}
;
;
			var type_inst = new plugin.Type(plugin);
;
			type_inst.name = m[0];
			type_inst.is_family = m[2];
			type_inst.instvar_sids = m[3].slice(0);
			type_inst.vars_count = m[3].length;
			type_inst.behs_count = m[4];
			type_inst.fx_count = m[5];
			type_inst.sid = m[11];
			if (type_inst.is_family)
			{
				type_inst.members = [];				// types in this family
				type_inst.family_index = this.family_count++;
				type_inst.families = null;
			}
			else
			{
				type_inst.members = null;
				type_inst.family_index = -1;
				type_inst.families = [];			// families this type belongs to
			}
			type_inst.family_var_map = null;
			type_inst.family_beh_map = null;
			type_inst.family_fx_map = null;
			type_inst.is_contained = false;
			type_inst.container = null;
			if (m[6])
			{
				type_inst.texture_file = m[6][0];
				type_inst.texture_filesize = m[6][1];
				type_inst.texture_pixelformat = m[6][2];
			}
			else
			{
				type_inst.texture_file = null;
				type_inst.texture_filesize = 0;
				type_inst.texture_pixelformat = 0;		// rgba8
			}
			if (m[7])
			{
				type_inst.animations = m[7];
			}
			else
			{
				type_inst.animations = null;
			}
			type_inst.index = i;                                // save index in to types array in type
			type_inst.instances = [];                           // all instances of this type
			type_inst.deadCache = [];							// destroyed instances to recycle next create
			type_inst.solstack = [new cr.selection(type_inst)]; // initialise SOL stack with one empty SOL
			type_inst.cur_sol = 0;
			type_inst.default_instance = null;
			type_inst.default_layerindex = 0;
			type_inst.stale_iids = true;
			type_inst.updateIIDs = cr.type_updateIIDs;
			type_inst.getFirstPicked = cr.type_getFirstPicked;
			type_inst.getPairedInstance = cr.type_getPairedInstance;
			type_inst.getCurrentSol = cr.type_getCurrentSol;
			type_inst.pushCleanSol = cr.type_pushCleanSol;
			type_inst.pushCopySol = cr.type_pushCopySol;
			type_inst.popSol = cr.type_popSol;
			type_inst.getBehaviorByName = cr.type_getBehaviorByName;
			type_inst.getBehaviorIndexByName = cr.type_getBehaviorIndexByName;
			type_inst.getEffectIndexByName = cr.type_getEffectIndexByName;
			type_inst.applySolToContainer = cr.type_applySolToContainer;
			type_inst.getInstanceByIID = cr.type_getInstanceByIID;
			type_inst.collision_grid = new cr.SparseGrid(this.original_width, this.original_height);
			type_inst.any_cell_changed = true;
			type_inst.any_instance_parallaxed = false;
			type_inst.extra = {};
			type_inst.toString = cr.type_toString;
			type_inst.behaviors = [];
			for (j = 0, lenj = m[8].length; j < lenj; j++)
			{
				b = m[8][j];
				var behavior_ctor = this.GetObjectReference(b[1]);
				var behavior_plugin = null;
				for (k = 0, lenk = this.behaviors.length; k < lenk; k++)
				{
					if (this.behaviors[k] instanceof behavior_ctor)
					{
						behavior_plugin = this.behaviors[k];
						break;
					}
				}
				if (!behavior_plugin)
				{
					behavior_plugin = new behavior_ctor(this);
					behavior_plugin.my_types = [];						// types using this behavior
					behavior_plugin.my_instances = new cr.ObjectSet(); 	// instances of this behavior
					if (behavior_plugin.onCreate)
						behavior_plugin.onCreate();
					cr.seal(behavior_plugin);
					this.behaviors.push(behavior_plugin);
					if (cr.behaviors.solid && behavior_plugin instanceof cr.behaviors.solid)
						this.solidBehavior = behavior_plugin;
					if (cr.behaviors.jumpthru && behavior_plugin instanceof cr.behaviors.jumpthru)
						this.jumpthruBehavior = behavior_plugin;
					if (cr.behaviors.shadowcaster && behavior_plugin instanceof cr.behaviors.shadowcaster)
						this.shadowcasterBehavior = behavior_plugin;
				}
				if (behavior_plugin.my_types.indexOf(type_inst) === -1)
					behavior_plugin.my_types.push(type_inst);
				var behavior_type = new behavior_plugin.Type(behavior_plugin, type_inst);
				behavior_type.name = b[0];
				behavior_type.sid = b[2];
				behavior_type.onCreate();
				cr.seal(behavior_type);
				type_inst.behaviors.push(behavior_type);
			}
			type_inst.global = m[9];
			type_inst.isOnLoaderLayout = m[10];
			type_inst.effect_types = [];
			for (j = 0, lenj = m[12].length; j < lenj; j++)
			{
				type_inst.effect_types.push({
					id: m[12][j][0],
					name: m[12][j][1],
					shaderindex: -1,
					preservesOpaqueness: false,
					active: true,
					index: j
				});
			}
			type_inst.tile_poly_data = m[13];
			if (!this.uses_loader_layout || type_inst.is_family || type_inst.isOnLoaderLayout || !plugin.is_world)
			{
				type_inst.onCreate();
				cr.seal(type_inst);
			}
			if (type_inst.name)
				this.types[type_inst.name] = type_inst;
			this.types_by_index.push(type_inst);
			if (plugin.singleglobal)
			{
				var instance = new plugin.Instance(type_inst);
				instance.uid = this.next_uid++;
				instance.puid = this.next_puid++;
				instance.iid = 0;
				instance.get_iid = cr.inst_get_iid;
				instance.toString = cr.inst_toString;
				instance.properties = m[14];
				instance.onCreate();
				cr.seal(instance);
				type_inst.instances.push(instance);
				this.objectsByUid[instance.uid.toString()] = instance;
			}
		}
		for (i = 0, len = pm[4].length; i < len; i++)
		{
			var familydata = pm[4][i];
			var familytype = this.types_by_index[familydata[0]];
			var familymember;
			for (j = 1, lenj = familydata.length; j < lenj; j++)
			{
				familymember = this.types_by_index[familydata[j]];
				familymember.families.push(familytype);
				familytype.members.push(familymember);
			}
		}
		for (i = 0, len = pm[28].length; i < len; i++)
		{
			var containerdata = pm[28][i];
			var containertypes = [];
			for (j = 0, lenj = containerdata.length; j < lenj; j++)
				containertypes.push(this.types_by_index[containerdata[j]]);
			for (j = 0, lenj = containertypes.length; j < lenj; j++)
			{
				containertypes[j].is_contained = true;
				containertypes[j].container = containertypes;
			}
		}
		if (this.family_count > 0)
		{
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				t = this.types_by_index[i];
				if (t.is_family || !t.families.length)
					continue;
				t.family_var_map = new Array(this.family_count);
				t.family_beh_map = new Array(this.family_count);
				t.family_fx_map = new Array(this.family_count);
				var all_fx = [];
				var varsum = 0;
				var behsum = 0;
				var fxsum = 0;
				for (j = 0, lenj = t.families.length; j < lenj; j++)
				{
					f = t.families[j];
					t.family_var_map[f.family_index] = varsum;
					varsum += f.vars_count;
					t.family_beh_map[f.family_index] = behsum;
					behsum += f.behs_count;
					t.family_fx_map[f.family_index] = fxsum;
					fxsum += f.fx_count;
					for (k = 0, lenk = f.effect_types.length; k < lenk; k++)
						all_fx.push(cr.shallowCopy({}, f.effect_types[k]));
				}
				t.effect_types = all_fx.concat(t.effect_types);
				for (j = 0, lenj = t.effect_types.length; j < lenj; j++)
					t.effect_types[j].index = j;
			}
		}
		for (i = 0, len = pm[5].length; i < len; i++)
		{
			m = pm[5][i];
			var layout = new cr.layout(this, m);
			cr.seal(layout);
			this.layouts[layout.name] = layout;
			this.layouts_by_index.push(layout);
		}
		for (i = 0, len = pm[6].length; i < len; i++)
		{
			m = pm[6][i];
			var sheet = new cr.eventsheet(this, m);
			cr.seal(sheet);
			this.eventsheets[sheet.name] = sheet;
			this.eventsheets_by_index.push(sheet);
		}
		for (i = 0, len = this.eventsheets_by_index.length; i < len; i++)
			this.eventsheets_by_index[i].postInit();
		for (i = 0, len = this.eventsheets_by_index.length; i < len; i++)
			this.eventsheets_by_index[i].updateDeepIncludes();
		for (i = 0, len = this.triggers_to_postinit.length; i < len; i++)
			this.triggers_to_postinit[i].postInit();
		cr.clearArray(this.triggers_to_postinit)
		this.audio_to_preload = pm[7];
		this.files_subfolder = pm[8];
		this.pixel_rounding = pm[9];
		this.aspect_scale = 1.0;
		this.enableWebGL = pm[13];
		this.linearSampling = pm[14];
		this.clearBackground = pm[15];
		this.versionstr = pm[16];
		this.useHighDpi = pm[17];
		this.orientations = pm[20];		// 0 = any, 1 = portrait, 2 = landscape
		this.autoLockOrientation = (this.orientations > 0);
		this.pauseOnBlur = pm[22];
		this.wantFullscreenScalingQuality = pm[23];		// false = low quality, true = high quality
		this.fullscreenScalingQuality = this.wantFullscreenScalingQuality;
		this.downscalingQuality = pm[24];	// 0 = low (mips off), 1 = medium (mips on, dense spritesheet), 2 = high (mips on, sparse spritesheet)
		this.preloadSounds = pm[25];		// 0 = no, 1 = yes
		this.projectName = pm[26];
		this.enableFrontToBack = pm[27] && !this.isIE;		// front-to-back renderer disabled in IE (but not Edge)
		this.start_time = Date.now();
		cr.clearArray(this.objectRefTable);
		this.initRendererAndLoader();
	};
	var anyImageHadError = false;
	var MAX_PARALLEL_IMAGE_LOADS = 100;
	var currentlyActiveImageLoads = 0;
	var imageLoadQueue = [];		// array of [img, srcToSet]
	Runtime.prototype.queueImageLoad = function (img_, src_)
	{
		var self = this;
		var doneFunc = function ()
		{
			currentlyActiveImageLoads--;
			self.maybeLoadNextImages();
		};
		img_.addEventListener("load", doneFunc);
		img_.addEventListener("error", doneFunc);
		imageLoadQueue.push([img_, src_]);
		this.maybeLoadNextImages();
	};
	Runtime.prototype.maybeLoadNextImages = function ()
	{
		var next;
		while (imageLoadQueue.length && currentlyActiveImageLoads < MAX_PARALLEL_IMAGE_LOADS)
		{
			currentlyActiveImageLoads++;
			next = imageLoadQueue.shift();
			this.setImageSrc(next[0], next[1]);
		}
	};
	Runtime.prototype.waitForImageLoad = function (img_, src_)
	{
		img_["cocoonLazyLoad"] = true;
		img_.onerror = function (e)
		{
			img_.c2error = true;
			anyImageHadError = true;
			if (console && console.error)
				console.error("Error loading image '" + img_.src + "': ", e);
		};
		if (this.isEjecta)
		{
			img_.src = src_;
		}
		else if (!img_.src)
		{
			if (typeof XAPKReader !== "undefined")
			{
				XAPKReader.get(src_, function (expanded_url)
				{
					img_.src = expanded_url;
				}, function (e)
				{
					img_.c2error = true;
					anyImageHadError = true;
					if (console && console.error)
						console.error("Error extracting image '" + src_ + "' from expansion file: ", e);
				});
			}
			else
			{
				img_.crossOrigin = "anonymous";			// required for Arcade sandbox compatibility
				this.queueImageLoad(img_, src_);		// use a queue to avoid requesting all images simultaneously
			}
		}
		this.wait_for_textures.push(img_);
	};
	Runtime.prototype.findWaitingTexture = function (src_)
	{
		var i, len;
		for (i = 0, len = this.wait_for_textures.length; i < len; i++)
		{
			if (this.wait_for_textures[i].cr_src === src_)
				return this.wait_for_textures[i];
		}
		return null;
	};
	var audio_preload_totalsize = 0;
	var audio_preload_started = false;
	Runtime.prototype.getready = function ()
	{
		if (!this.audioInstance)
			return;
		audio_preload_totalsize = this.audioInstance.setPreloadList(this.audio_to_preload);
	};
	Runtime.prototype.areAllTexturesAndSoundsLoaded = function ()
	{
		var totalsize = audio_preload_totalsize;
		var completedsize = 0;
		var audiocompletedsize = 0;
		var ret = true;
		var i, len, img;
		for (i = 0, len = this.wait_for_textures.length; i < len; i++)
		{
			img = this.wait_for_textures[i];
			var filesize = img.cr_filesize;
			if (!filesize || filesize <= 0)
				filesize = 50000;
			totalsize += filesize;
			if (!!img.src && (img.complete || img["loaded"]) && !img.c2error)
				completedsize += filesize;
			else
				ret = false;    // not all textures loaded
		}
		if (ret && this.preloadSounds && this.audioInstance)
		{
			if (!audio_preload_started)
			{
				this.audioInstance.startPreloads();
				audio_preload_started = true;
			}
			audiocompletedsize = this.audioInstance.getPreloadedSize();
			completedsize += audiocompletedsize;
			if (audiocompletedsize < audio_preload_totalsize)
				ret = false;		// not done yet
		}
		if (totalsize == 0)
			this.progress = 1;		// indicate to C2 splash loader that it can finish now
		else
			this.progress = (completedsize / totalsize);
		return ret;
	};
	var isC2SplashDone = false;
	Runtime.prototype.go = function ()
	{
		if (!this.ctx && !this.glwrap)
			return;
		var ctx = this.ctx || this.overlay_ctx;
		if (this.overlay_canvas)
			this.positionOverlayCanvas();
		var curwidth = window.innerWidth;
		var curheight = window.innerHeight;
		if (this.lastWindowWidth !== curwidth || this.lastWindowHeight !== curheight)
		{
			this["setSize"](curwidth, curheight);
		}
		this.progress = 0;
		this.last_progress = -1;
		var self = this;
		if (this.areAllTexturesAndSoundsLoaded() && (this.loaderstyle !== 4 || isC2SplashDone))
		{
			this.go_loading_finished();
		}
		else
		{
			var ms_elapsed = Date.now() - this.start_time;
			if (ctx)
			{
				var overlay_width = this.width;
				var overlay_height = this.height;
				var dpr = this.devicePixelRatio;
				if (this.loaderstyle < 3 && (this.isCocoonJs || (ms_elapsed >= 500 && this.last_progress != this.progress)))
				{
					ctx.clearRect(0, 0, overlay_width, overlay_height);
					var mx = overlay_width / 2;
					var my = overlay_height / 2;
					var haslogo = (this.loaderstyle === 0 && this.loaderlogos.logo.complete);
					var hlw = 40 * dpr;
					var hlh = 0;
					var logowidth = 80 * dpr;
					var logoheight;
					if (haslogo)
					{
						var loaderLogoImage = this.loaderlogos.logo;
						logowidth = loaderLogoImage.width * dpr;
						logoheight = loaderLogoImage.height * dpr;
						hlw = logowidth / 2;
						hlh = logoheight / 2;
						ctx.drawImage(loaderLogoImage, cr.floor(mx - hlw), cr.floor(my - hlh), logowidth, logoheight);
					}
					if (this.loaderstyle <= 1)
					{
						my += hlh + (haslogo ? 12 * dpr : 0);
						mx -= hlw;
						mx = cr.floor(mx) + 0.5;
						my = cr.floor(my) + 0.5;
						ctx.fillStyle = anyImageHadError ? "red" : "DodgerBlue";
						ctx.fillRect(mx, my, Math.floor(logowidth * this.progress), 6 * dpr);
						ctx.strokeStyle = "black";
						ctx.strokeRect(mx, my, logowidth, 6 * dpr);
						ctx.strokeStyle = "white";
						ctx.strokeRect(mx - 1 * dpr, my - 1 * dpr, logowidth + 2 * dpr, 8 * dpr);
					}
					else if (this.loaderstyle === 2)
					{
						ctx.font = (this.isEjecta ? "12pt ArialMT" : "12pt Arial");
						ctx.fillStyle = anyImageHadError ? "#f00" : "#999";
						ctx.textBaseLine = "middle";
						var percent_text = Math.round(this.progress * 100) + "%";
						var text_dim = ctx.measureText ? ctx.measureText(percent_text) : null;
						var text_width = text_dim ? text_dim.width : 0;
						ctx.fillText(percent_text, mx - (text_width / 2), my);
					}
					this.last_progress = this.progress;
				}
				else if (this.loaderstyle === 4)
				{
					this.draw_c2_splash_loader(ctx);
					if (raf)
						raf(function() { self.go(); });
					else
						setTimeout(function() { self.go(); }, 16);
					return;
				}
			}
			setTimeout(function() { self.go(); }, (this.isCocoonJs ? 10 : 100));
		}
	};
	var splashStartTime = -1;
	var splashFadeInDuration = 300;
	var splashFadeOutDuration = 300;
	var splashAfterFadeOutWait = (typeof cr_is_preview === "undefined" ? 200 : 0);
	var splashIsFadeIn = true;
	var splashIsFadeOut = false;
	var splashFadeInFinish = 0;
	var splashFadeOutStart = 0;
	var splashMinDisplayTime = (typeof cr_is_preview === "undefined" ? 3000 : 0);
	var renderViaCanvas = null;
	var renderViaCtx = null;
	var splashFrameNumber = 0;
	function maybeCreateRenderViaCanvas(w, h)
	{
		if (!renderViaCanvas || renderViaCanvas.width !== w || renderViaCanvas.height !== h)
		{
			renderViaCanvas = document.createElement("canvas");
			renderViaCanvas.width = w;
			renderViaCanvas.height = h;
			renderViaCtx = renderViaCanvas.getContext("2d");
		}
	};
	function mipImage(arr, size)
	{
		if (size <= 128)
			return arr[3];
		else if (size <= 256)
			return arr[2];
		else if (size <= 512)
			return arr[1];
		else
			return arr[0];
	};
	Runtime.prototype.draw_c2_splash_loader = function(ctx)
	{
		if (isC2SplashDone)
			return;
		var w = Math.ceil(this.width);
		var h = Math.ceil(this.height);
		var dpr = this.devicePixelRatio;
		var logoimages = this.loaderlogos.logo;
		var poweredimages = this.loaderlogos.powered;
		var websiteimages = this.loaderlogos.website;
		for (var i = 0; i < 4; ++i)
		{
			if (!logoimages[i].complete || !poweredimages[i].complete || !websiteimages[i].complete)
				return;
		}
		if (splashFrameNumber === 0)
			splashStartTime = Date.now();
		var nowTime = Date.now();
		var isRenderingVia = false;
		var renderToCtx = ctx;
		var drawW, drawH;
		if (splashIsFadeIn || splashIsFadeOut)
		{
			ctx.clearRect(0, 0, w, h);
			maybeCreateRenderViaCanvas(w, h);
			renderToCtx = renderViaCtx;
			isRenderingVia = true;
			if (splashIsFadeIn && splashFrameNumber === 1)
				splashStartTime = Date.now();
		}
		else
		{
			ctx.globalAlpha = 1;
		}
		renderToCtx.fillStyle = "#333333";
		renderToCtx.fillRect(0, 0, w, h);
		if (this.cssHeight > 256)
		{
			drawW = cr.clamp(h * 0.22, 105, w * 0.6);
			drawH = drawW * 0.25;
			renderToCtx.drawImage(mipImage(poweredimages, drawW), w * 0.5 - drawW/2, h * 0.2 - drawH/2, drawW, drawH);
			drawW = Math.min(h * 0.395, w * 0.95);
			drawH = drawW;
			renderToCtx.drawImage(mipImage(logoimages, drawW), w * 0.5 - drawW/2, h * 0.485 - drawH/2, drawW, drawH);
			drawW = cr.clamp(h * 0.22, 105, w * 0.6);
			drawH = drawW * 0.25;
			renderToCtx.drawImage(mipImage(websiteimages, drawW), w * 0.5 - drawW/2, h * 0.868 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = "#3C3C3C";
			drawW = w;
			drawH = Math.max(h * 0.005, 2);
			renderToCtx.fillRect(0, h * 0.8 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = anyImageHadError ? "red" : "#E0FF65";
			drawW = w * this.progress;
			renderToCtx.fillRect(w * 0.5 - drawW/2, h * 0.8 - drawH/2, drawW, drawH);
		}
		else
		{
			drawW = h * 0.55;
			drawH = drawW;
			renderToCtx.drawImage(mipImage(logoimages, drawW), w * 0.5 - drawW/2, h * 0.45 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = "#3C3C3C";
			drawW = w;
			drawH = Math.max(h * 0.005, 2);
			renderToCtx.fillRect(0, h * 0.85 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = anyImageHadError ? "red" : "#E0FF65";
			drawW = w * this.progress;
			renderToCtx.fillRect(w * 0.5 - drawW/2, h * 0.85 - drawH/2, drawW, drawH);
		}
		if (isRenderingVia)
		{
			if (splashIsFadeIn)
			{
				if (splashFrameNumber === 0)
					ctx.globalAlpha = 0;
				else
					ctx.globalAlpha = Math.min((nowTime - splashStartTime) / splashFadeInDuration, 1);
			}
			else if (splashIsFadeOut)
			{
				ctx.globalAlpha = Math.max(1 - (nowTime - splashFadeOutStart) / splashFadeOutDuration, 0);
			}
			ctx.drawImage(renderViaCanvas, 0, 0, w, h);
		}
		if (splashIsFadeIn && nowTime - splashStartTime >= splashFadeInDuration && splashFrameNumber >= 2)
		{
			splashIsFadeIn = false;
			splashFadeInFinish = nowTime;
		}
		if (!splashIsFadeIn && nowTime - splashFadeInFinish >= splashMinDisplayTime && !splashIsFadeOut && this.progress >= 1)
		{
			splashIsFadeOut = true;
			splashFadeOutStart = nowTime;
		}
		if ((splashIsFadeOut && nowTime - splashFadeOutStart >= splashFadeOutDuration + splashAfterFadeOutWait) ||
			(typeof cr_is_preview !== "undefined" && this.progress >= 1 && Date.now() - splashStartTime < 500))
		{
			isC2SplashDone = true;
			splashIsFadeIn = false;
			splashIsFadeOut = false;
			renderViaCanvas = null;
			renderViaCtx = null;
			this.loaderlogos = null;
		}
		++splashFrameNumber;
	};
	Runtime.prototype.go_loading_finished = function ()
	{
		if (this.overlay_canvas)
		{
			this.canvas.parentNode.removeChild(this.overlay_canvas);
			this.overlay_ctx = null;
			this.overlay_canvas = null;
		}
		this.start_time = Date.now();
		this.last_fps_time = cr.performance_now();       // for counting framerate
		var i, len, t;
		if (this.uses_loader_layout)
		{
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				t = this.types_by_index[i];
				if (!t.is_family && !t.isOnLoaderLayout && t.plugin.is_world)
				{
					t.onCreate();
					cr.seal(t);
				}
			}
		}
		else
			this.isloading = false;
		for (i = 0, len = this.layouts_by_index.length; i < len; i++)
		{
			this.layouts_by_index[i].createGlobalNonWorlds();
		}
		if (this.fullscreen_mode >= 2)
		{
			var orig_aspect = this.original_width / this.original_height;
			var cur_aspect = this.width / this.height;
			if ((this.fullscreen_mode !== 2 && cur_aspect > orig_aspect) || (this.fullscreen_mode === 2 && cur_aspect < orig_aspect))
				this.aspect_scale = this.height / this.original_height;
			else
				this.aspect_scale = this.width / this.original_width;
		}
		if (this.first_layout)
			this.layouts[this.first_layout].startRunning();
		else
			this.layouts_by_index[0].startRunning();
;
		if (!this.uses_loader_layout)
		{
			this.loadingprogress = 1;
			this.trigger(cr.system_object.prototype.cnds.OnLoadFinished, null);
			if (window["C2_RegisterSW"])		// note not all platforms use SW
				window["C2_RegisterSW"]();
		}
		if (navigator["splashscreen"] && navigator["splashscreen"]["hide"])
			navigator["splashscreen"]["hide"]();
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			t = this.types_by_index[i];
			if (t.onAppBegin)
				t.onAppBegin();
		}
		if (document["hidden"] || document["webkitHidden"] || document["mozHidden"] || document["msHidden"])
		{
			window["cr_setSuspended"](true);		// stop rendering
		}
		else
		{
			this.tick(false);
		}
		if (this.isDirectCanvas)
			AppMobi["webview"]["execute"]("onGameReady();");
	};
	Runtime.prototype.tick = function (background_wake, timestamp, debug_step)
	{
		if (!this.running_layout)
			return;
		var nowtime = cr.performance_now();
		var logic_start = nowtime;
		if (!debug_step && this.isSuspended && !background_wake)
			return;
		if (!background_wake)
		{
			if (raf)
				this.raf_id = raf(this.tickFunc);
			else
			{
				this.timeout_id = setTimeout(this.tickFunc, this.isMobile ? 1 : 16);
			}
		}
		var raf_time = timestamp || nowtime;
		var fsmode = this.fullscreen_mode;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || document["fullScreen"] || !!document["msFullscreenElement"]) && !this.isCordova;
		if ((isfullscreen || this.isNodeFullscreen) && this.fullscreen_scaling > 0)
			fsmode = this.fullscreen_scaling;
		if (fsmode > 0)	// r222: experimentally enabling this workaround for all platforms
		{
			var curwidth = window.innerWidth;
			var curheight = window.innerHeight;
			if (this.lastWindowWidth !== curwidth || this.lastWindowHeight !== curheight)
			{
				this["setSize"](curwidth, curheight);
			}
		}
		if (!this.isDomFree)
		{
			if (isfullscreen)
			{
				if (!this.firstInFullscreen)
					this.firstInFullscreen = true;
			}
			else
			{
				if (this.firstInFullscreen)
				{
					this.firstInFullscreen = false;
					if (this.fullscreen_mode === 0)
					{
						this["setSize"](Math.round(this.oldWidth / this.devicePixelRatio), Math.round(this.oldHeight / this.devicePixelRatio), true);
					}
				}
				else
				{
					this.oldWidth = this.width;
					this.oldHeight = this.height;
				}
			}
		}
		if (this.isloading)
		{
			var done = this.areAllTexturesAndSoundsLoaded();		// updates this.progress
			this.loadingprogress = this.progress;
			if (done)
			{
				this.isloading = false;
				this.progress = 1;
				this.trigger(cr.system_object.prototype.cnds.OnLoadFinished, null);
				if (window["C2_RegisterSW"])
					window["C2_RegisterSW"]();
			}
		}
		this.logic(raf_time);
		if ((this.redraw || this.isCocoonJs) && !this.is_WebGL_context_lost && !this.suspendDrawing && !background_wake)
		{
			this.redraw = false;
			if (this.glwrap)
				this.drawGL();
			else
				this.draw();
			if (this.snapshotCanvas)
			{
				if (this.canvas && this.canvas.toDataURL)
				{
					this.snapshotData = this.canvas.toDataURL(this.snapshotCanvas[0], this.snapshotCanvas[1]);
					if (window["cr_onSnapshot"])
						window["cr_onSnapshot"](this.snapshotData);
					this.trigger(cr.system_object.prototype.cnds.OnCanvasSnapshot, null);
				}
				this.snapshotCanvas = null;
			}
		}
		if (!this.hit_breakpoint)
		{
			this.tickcount++;
			this.tickcount_nosave++;
			this.execcount++;
			this.framecount++;
		}
		this.logictime += cr.performance_now() - logic_start;
	};
	Runtime.prototype.logic = function (cur_time)
	{
		var i, leni, j, lenj, k, lenk, type, inst, binst;
		if (cur_time - this.last_fps_time >= 1000)  // every 1 second
		{
			this.last_fps_time += 1000;
			if (cur_time - this.last_fps_time >= 1000)
				this.last_fps_time = cur_time;
			this.fps = this.framecount;
			this.framecount = 0;
			this.cpuutilisation = this.logictime;
			this.logictime = 0;
		}
		var wallDt = 0;
		if (this.last_tick_time !== 0)
		{
			var ms_diff = cur_time - this.last_tick_time;
			if (ms_diff < 0)
				ms_diff = 0;
			wallDt = ms_diff / 1000.0; // dt measured in seconds
			this.dt1 = wallDt;
			if (this.dt1 > 0.5)
				this.dt1 = 0;
			else if (this.dt1 > 1 / this.minimumFramerate)
				this.dt1 = 1 / this.minimumFramerate;
		}
		this.last_tick_time = cur_time;
        this.dt = this.dt1 * this.timescale;
        this.kahanTime.add(this.dt);
		this.wallTime.add(wallDt);		// prevent min/max framerate affecting wall clock
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || document["fullScreen"] || !!document["msFullscreenElement"] || this.isNodeFullscreen) && !this.isCordova;
		if (this.fullscreen_mode >= 2 /* scale */ || (isfullscreen && this.fullscreen_scaling > 0))
		{
			var orig_aspect = this.original_width / this.original_height;
			var cur_aspect = this.width / this.height;
			var mode = this.fullscreen_mode;
			if (isfullscreen && this.fullscreen_scaling > 0)
				mode = this.fullscreen_scaling;
			if ((mode !== 2 && cur_aspect > orig_aspect) || (mode === 2 && cur_aspect < orig_aspect))
			{
				this.aspect_scale = this.height / this.original_height;
			}
			else
			{
				this.aspect_scale = this.width / this.original_width;
			}
			if (this.running_layout)
			{
				this.running_layout.scrollToX(this.running_layout.scrollX);
				this.running_layout.scrollToY(this.running_layout.scrollY);
			}
		}
		else
			this.aspect_scale = (this.isRetina ? this.devicePixelRatio : 1);
		this.ClearDeathRow();
		this.isInOnDestroy++;
		this.system.runWaits();		// prevent instance list changing
		this.isInOnDestroy--;
		this.ClearDeathRow();		// allow instance list changing
		this.isInOnDestroy++;
        var tickarr = this.objects_to_pretick.valuesRef();
        for (i = 0, leni = tickarr.length; i < leni; i++)
            tickarr[i].pretick();
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || (!type.behaviors.length && !type.families.length))
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					inst.behavior_insts[k].tick();
				}
			}
		}
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || (!type.behaviors.length && !type.families.length))
				continue;	// type doesn't have any behaviors
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					binst = inst.behavior_insts[k];
					if (binst.posttick)
						binst.posttick();
				}
			}
		}
        tickarr = this.objects_to_tick.valuesRef();
        for (i = 0, leni = tickarr.length; i < leni; i++)
            tickarr[i].tick();
		this.isInOnDestroy--;		// end preventing instance lists from being changed
		this.handleSaveLoad();		// save/load now if queued
		i = 0;
		while (this.changelayout && i++ < 10)
		{
			this.doChangeLayout(this.changelayout);
		}
        for (i = 0, leni = this.eventsheets_by_index.length; i < leni; i++)
            this.eventsheets_by_index[i].hasRun = false;
		if (this.running_layout.event_sheet)
			this.running_layout.event_sheet.run();
		cr.clearArray(this.registered_collisions);
		this.layout_first_tick = false;
		this.isInOnDestroy++;		// prevent instance lists from being changed
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || (!type.behaviors.length && !type.families.length))
				continue;	// type doesn't have any behaviors
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				var inst = type.instances[j];
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					binst = inst.behavior_insts[k];
					if (binst.tick2)
						binst.tick2();
				}
			}
		}
        tickarr = this.objects_to_tick2.valuesRef();
        for (i = 0, leni = tickarr.length; i < leni; i++)
            tickarr[i].tick2();
		this.isInOnDestroy--;		// end preventing instance lists from being changed
	};
	Runtime.prototype.onWindowBlur = function ()
	{
		var i, leni, j, lenj, k, lenk, type, inst, binst;
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				if (inst.onWindowBlur)
					inst.onWindowBlur();
				if (!inst.behavior_insts)
					continue;	// single-globals don't have behavior_insts
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					binst = inst.behavior_insts[k];
					if (binst.onWindowBlur)
						binst.onWindowBlur();
				}
			}
		}
	};
	Runtime.prototype.doChangeLayout = function (changeToLayout)
	{
		var prev_layout = this.running_layout;
		this.running_layout.stopRunning();
		var i, len, j, lenj, k, lenk, type, inst, binst;
		if (this.glwrap)
		{
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				type = this.types_by_index[i];
				if (type.is_family)
					continue;
				if (type.unloadTextures && (!type.global || type.instances.length === 0) && changeToLayout.initial_types.indexOf(type) === -1)
				{
					type.unloadTextures();
				}
			}
		}
		if (prev_layout == changeToLayout)
			cr.clearArray(this.system.waits);
		cr.clearArray(this.registered_collisions);
		this.runLayoutChangeMethods(true);
		changeToLayout.startRunning();
		this.runLayoutChangeMethods(false);
		this.redraw = true;
		this.layout_first_tick = true;
		this.ClearDeathRow();
	};
	Runtime.prototype.runLayoutChangeMethods = function (isBeforeChange)
	{
		var i, len, beh, type, j, lenj, inst, k, lenk, binst;
		for (i = 0, len = this.behaviors.length; i < len; i++)
		{
			beh = this.behaviors[i];
			if (isBeforeChange)
			{
				if (beh.onBeforeLayoutChange)
					beh.onBeforeLayoutChange();
			}
			else
			{
				if (beh.onLayoutChange)
					beh.onLayoutChange();
			}
		}
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (!type.global && !type.plugin.singleglobal)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				if (isBeforeChange)
				{
					if (inst.onBeforeLayoutChange)
						inst.onBeforeLayoutChange();
				}
				else
				{
					if (inst.onLayoutChange)
						inst.onLayoutChange();
				}
				if (inst.behavior_insts)
				{
					for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
					{
						binst = inst.behavior_insts[k];
						if (isBeforeChange)
						{
							if (binst.onBeforeLayoutChange)
								binst.onBeforeLayoutChange();
						}
						else
						{
							if (binst.onLayoutChange)
								binst.onLayoutChange();
						}
					}
				}
			}
		}
	};
	Runtime.prototype.pretickMe = function (inst)
    {
        this.objects_to_pretick.add(inst);
    };
	Runtime.prototype.unpretickMe = function (inst)
	{
		this.objects_to_pretick.remove(inst);
	};
    Runtime.prototype.tickMe = function (inst)
    {
        this.objects_to_tick.add(inst);
    };
	Runtime.prototype.untickMe = function (inst)
	{
		this.objects_to_tick.remove(inst);
	};
	Runtime.prototype.tick2Me = function (inst)
    {
        this.objects_to_tick2.add(inst);
    };
	Runtime.prototype.untick2Me = function (inst)
	{
		this.objects_to_tick2.remove(inst);
	};
    Runtime.prototype.getDt = function (inst)
    {
        if (!inst || inst.my_timescale === -1.0)
            return this.dt;
        return this.dt1 * inst.my_timescale;
    };
	Runtime.prototype.draw = function ()
	{
		this.running_layout.draw(this.ctx);
		if (this.isDirectCanvas)
			this.ctx["present"]();
	};
	Runtime.prototype.drawGL = function ()
	{
		if (this.enableFrontToBack)
		{
			this.earlyz_index = 1;		// start from front, 1-based to avoid exactly equalling near plane Z value
			this.running_layout.drawGL_earlyZPass(this.glwrap);
		}
		this.running_layout.drawGL(this.glwrap);
		this.glwrap.present();
	};
	Runtime.prototype.addDestroyCallback = function (f)
	{
		if (f)
			this.destroycallbacks.push(f);
	};
	Runtime.prototype.removeDestroyCallback = function (f)
	{
		cr.arrayFindRemove(this.destroycallbacks, f);
	};
	Runtime.prototype.getObjectByUID = function (uid_)
	{
;
		var uidstr = uid_.toString();
		if (this.objectsByUid.hasOwnProperty(uidstr))
			return this.objectsByUid[uidstr];
		else
			return null;
	};
	var objectset_cache = [];
	function alloc_objectset()
	{
		if (objectset_cache.length)
			return objectset_cache.pop();
		else
			return new cr.ObjectSet();
	};
	function free_objectset(s)
	{
		s.clear();
		objectset_cache.push(s);
	};
	Runtime.prototype.DestroyInstance = function (inst)
	{
		var i, len;
		var type = inst.type;
		var typename = type.name;
		var has_typename = this.deathRow.hasOwnProperty(typename);
		var obj_set = null;
		if (has_typename)
		{
			obj_set = this.deathRow[typename];
			if (obj_set.contains(inst))
				return;		// already had DestroyInstance called
		}
		else
		{
			obj_set = alloc_objectset();
			this.deathRow[typename] = obj_set;
		}
		obj_set.add(inst);
		this.hasPendingInstances = true;
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				this.DestroyInstance(inst.siblings[i]);
			}
		}
		if (this.isInClearDeathRow)
			obj_set.values_cache.push(inst);
		if (!this.isEndingLayout)
		{
			this.isInOnDestroy++;		// support recursion
			this.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnDestroyed, inst);
			this.isInOnDestroy--;
		}
	};
	Runtime.prototype.ClearDeathRow = function ()
	{
		if (!this.hasPendingInstances)
			return;
		var inst, type, instances;
		var i, j, leni, lenj, obj_set;
		this.isInClearDeathRow = true;
		for (i = 0, leni = this.createRow.length; i < leni; ++i)
		{
			inst = this.createRow[i];
			type = inst.type;
			type.instances.push(inst);
			for (j = 0, lenj = type.families.length; j < lenj; ++j)
			{
				type.families[j].instances.push(inst);
				type.families[j].stale_iids = true;
			}
		}
		cr.clearArray(this.createRow);
		this.IterateDeathRow();		// moved to separate function so for-in performance doesn't hobble entire function
		cr.wipe(this.deathRow);		// all objectsets have already been recycled
		this.isInClearDeathRow = false;
		this.hasPendingInstances = false;
	};
	Runtime.prototype.IterateDeathRow = function ()
	{
		for (var p in this.deathRow)
		{
			if (this.deathRow.hasOwnProperty(p))
			{
				this.ClearDeathRowForType(this.deathRow[p]);
			}
		}
	};
	Runtime.prototype.ClearDeathRowForType = function (obj_set)
	{
		var arr = obj_set.valuesRef();			// get array of items from set
;
		var type = arr[0].type;
;
;
		var i, len, j, lenj, w, f, layer_instances, inst;
		cr.arrayRemoveAllFromObjectSet(type.instances, obj_set);
		type.stale_iids = true;
		if (type.instances.length === 0)
			type.any_instance_parallaxed = false;
		for (i = 0, len = type.families.length; i < len; ++i)
		{
			f = type.families[i];
			cr.arrayRemoveAllFromObjectSet(f.instances, obj_set);
			f.stale_iids = true;
		}
		for (i = 0, len = this.system.waits.length; i < len; ++i)
		{
			w = this.system.waits[i];
			if (w.sols.hasOwnProperty(type.index))
				cr.arrayRemoveAllFromObjectSet(w.sols[type.index].insts, obj_set);
			if (!type.is_family)
			{
				for (j = 0, lenj = type.families.length; j < lenj; ++j)
				{
					f = type.families[j];
					if (w.sols.hasOwnProperty(f.index))
						cr.arrayRemoveAllFromObjectSet(w.sols[f.index].insts, obj_set);
				}
			}
		}
		var first_layer = arr[0].layer;
		if (first_layer)
		{
			if (first_layer.useRenderCells)
			{
				layer_instances = first_layer.instances;
				for (i = 0, len = layer_instances.length; i < len; ++i)
				{
					inst = layer_instances[i];
					if (!obj_set.contains(inst))
						continue;		// not destroying this instance
					inst.update_bbox();
					first_layer.render_grid.update(inst, inst.rendercells, null);
					inst.rendercells.set(0, 0, -1, -1);
				}
			}
			cr.arrayRemoveAllFromObjectSet(first_layer.instances, obj_set);
			first_layer.setZIndicesStaleFrom(0);
		}
		for (i = 0; i < arr.length; ++i)		// check array length every time in case it changes
		{
			this.ClearDeathRowForSingleInstance(arr[i], type);
		}
		free_objectset(obj_set);
		this.redraw = true;
	};
	Runtime.prototype.ClearDeathRowForSingleInstance = function (inst, type)
	{
		var i, len, binst;
		for (i = 0, len = this.destroycallbacks.length; i < len; ++i)
			this.destroycallbacks[i](inst);
		if (inst.collcells)
		{
			type.collision_grid.update(inst, inst.collcells, null);
		}
		var layer = inst.layer;
		if (layer)
		{
			layer.removeFromInstanceList(inst, true);		// remove from both instance list and render grid
		}
		if (inst.behavior_insts)
		{
			for (i = 0, len = inst.behavior_insts.length; i < len; ++i)
			{
				binst = inst.behavior_insts[i];
				if (binst.onDestroy)
					binst.onDestroy();
				binst.behavior.my_instances.remove(inst);
			}
		}
		this.objects_to_pretick.remove(inst);
		this.objects_to_tick.remove(inst);
		this.objects_to_tick2.remove(inst);
		if (inst.onDestroy)
			inst.onDestroy();
		if (this.objectsByUid.hasOwnProperty(inst.uid.toString()))
			delete this.objectsByUid[inst.uid.toString()];
		this.objectcount--;
		if (type.deadCache.length < 100)
			type.deadCache.push(inst);
	};
	Runtime.prototype.createInstance = function (type, layer, sx, sy)
	{
		if (type.is_family)
		{
			var i = cr.floor(Math.random() * type.members.length);
			return this.createInstance(type.members[i], layer, sx, sy);
		}
		if (!type.default_instance)
		{
			return null;
		}
		return this.createInstanceFromInit(type.default_instance, layer, false, sx, sy, false);
	};
	var all_behaviors = [];
	Runtime.prototype.createInstanceFromInit = function (initial_inst, layer, is_startup_instance, sx, sy, skip_siblings)
	{
		var i, len, j, lenj, p, effect_fallback, x, y;
		if (!initial_inst)
			return null;
		var type = this.types_by_index[initial_inst[1]];
;
;
		var is_world = type.plugin.is_world;
;
		if (this.isloading && is_world && !type.isOnLoaderLayout)
			return null;
		if (is_world && !this.glwrap && initial_inst[0][11] === 11)
			return null;
		var original_layer = layer;
		if (!is_world)
			layer = null;
		var inst;
		if (type.deadCache.length)
		{
			inst = type.deadCache.pop();
			inst.recycled = true;
			type.plugin.Instance.call(inst, type);
		}
		else
		{
			inst = new type.plugin.Instance(type);
			inst.recycled = false;
		}
		if (is_startup_instance && !skip_siblings && !this.objectsByUid.hasOwnProperty(initial_inst[2].toString()))
			inst.uid = initial_inst[2];
		else
			inst.uid = this.next_uid++;
		this.objectsByUid[inst.uid.toString()] = inst;
		inst.puid = this.next_puid++;
		inst.iid = type.instances.length;
		for (i = 0, len = this.createRow.length; i < len; ++i)
		{
			if (this.createRow[i].type === type)
				inst.iid++;
		}
		inst.get_iid = cr.inst_get_iid;
		inst.toString = cr.inst_toString;
		var initial_vars = initial_inst[3];
		if (inst.recycled)
		{
			cr.wipe(inst.extra);
		}
		else
		{
			inst.extra = {};
			if (typeof cr_is_preview !== "undefined")
			{
				inst.instance_var_names = [];
				inst.instance_var_names.length = initial_vars.length;
				for (i = 0, len = initial_vars.length; i < len; i++)
					inst.instance_var_names[i] = initial_vars[i][1];
			}
			inst.instance_vars = [];
			inst.instance_vars.length = initial_vars.length;
		}
		for (i = 0, len = initial_vars.length; i < len; i++)
			inst.instance_vars[i] = initial_vars[i][0];
		if (is_world)
		{
			var wm = initial_inst[0];
;
			inst.x = cr.is_undefined(sx) ? wm[0] : sx;
			inst.y = cr.is_undefined(sy) ? wm[1] : sy;
			inst.z = wm[2];
			inst.width = wm[3];
			inst.height = wm[4];
			inst.depth = wm[5];
			inst.angle = wm[6];
			inst.opacity = wm[7];
			inst.hotspotX = wm[8];
			inst.hotspotY = wm[9];
			inst.blend_mode = wm[10];
			effect_fallback = wm[11];
			if (!this.glwrap && type.effect_types.length)	// no WebGL renderer and shaders used
				inst.blend_mode = effect_fallback;			// use fallback blend mode - destroy mode was handled above
			inst.compositeOp = cr.effectToCompositeOp(inst.blend_mode);
			if (this.gl)
				cr.setGLBlend(inst, inst.blend_mode, this.gl);
			if (inst.recycled)
			{
				for (i = 0, len = wm[12].length; i < len; i++)
				{
					for (j = 0, lenj = wm[12][i].length; j < lenj; j++)
						inst.effect_params[i][j] = wm[12][i][j];
				}
				inst.bbox.set(0, 0, 0, 0);
				inst.collcells.set(0, 0, -1, -1);
				inst.rendercells.set(0, 0, -1, -1);
				inst.bquad.set_from_rect(inst.bbox);
				cr.clearArray(inst.bbox_changed_callbacks);
			}
			else
			{
				inst.effect_params = wm[12].slice(0);
				for (i = 0, len = inst.effect_params.length; i < len; i++)
					inst.effect_params[i] = wm[12][i].slice(0);
				inst.active_effect_types = [];
				inst.active_effect_flags = [];
				inst.active_effect_flags.length = type.effect_types.length;
				inst.bbox = new cr.rect(0, 0, 0, 0);
				inst.collcells = new cr.rect(0, 0, -1, -1);
				inst.rendercells = new cr.rect(0, 0, -1, -1);
				inst.bquad = new cr.quad();
				inst.bbox_changed_callbacks = [];
				inst.set_bbox_changed = cr.set_bbox_changed;
				inst.add_bbox_changed_callback = cr.add_bbox_changed_callback;
				inst.contains_pt = cr.inst_contains_pt;
				inst.update_bbox = cr.update_bbox;
				inst.update_render_cell = cr.update_render_cell;
				inst.update_collision_cell = cr.update_collision_cell;
				inst.get_zindex = cr.inst_get_zindex;
			}
			inst.tilemap_exists = false;
			inst.tilemap_width = 0;
			inst.tilemap_height = 0;
			inst.tilemap_data = null;
			if (wm.length === 14)
			{
				inst.tilemap_exists = true;
				inst.tilemap_width = wm[13][0];
				inst.tilemap_height = wm[13][1];
				inst.tilemap_data = wm[13][2];
			}
			for (i = 0, len = type.effect_types.length; i < len; i++)
				inst.active_effect_flags[i] = true;
			inst.shaders_preserve_opaqueness = true;
			inst.updateActiveEffects = cr.inst_updateActiveEffects;
			inst.updateActiveEffects();
			inst.uses_shaders = !!inst.active_effect_types.length;
			inst.bbox_changed = true;
			inst.cell_changed = true;
			type.any_cell_changed = true;
			inst.visible = true;
            inst.my_timescale = -1.0;
			inst.layer = layer;
			inst.zindex = layer.instances.length;	// will be placed at top of current layer
			inst.earlyz_index = 0;
			if (typeof inst.collision_poly === "undefined")
				inst.collision_poly = null;
			inst.collisionsEnabled = true;
			this.redraw = true;
		}
		var initial_props, binst;
		cr.clearArray(all_behaviors);
		for (i = 0, len = type.families.length; i < len; i++)
		{
			all_behaviors.push.apply(all_behaviors, type.families[i].behaviors);
		}
		all_behaviors.push.apply(all_behaviors, type.behaviors);
		if (inst.recycled)
		{
			for (i = 0, len = all_behaviors.length; i < len; i++)
			{
				var btype = all_behaviors[i];
				binst = inst.behavior_insts[i];
				binst.recycled = true;
				btype.behavior.Instance.call(binst, btype, inst);
				initial_props = initial_inst[4][i];
				for (j = 0, lenj = initial_props.length; j < lenj; j++)
					binst.properties[j] = initial_props[j];
				binst.onCreate();
				btype.behavior.my_instances.add(inst);
			}
		}
		else
		{
			inst.behavior_insts = [];
			for (i = 0, len = all_behaviors.length; i < len; i++)
			{
				var btype = all_behaviors[i];
				var binst = new btype.behavior.Instance(btype, inst);
				binst.recycled = false;
				binst.properties = initial_inst[4][i].slice(0);
				binst.onCreate();
				cr.seal(binst);
				inst.behavior_insts.push(binst);
				btype.behavior.my_instances.add(inst);
			}
		}
		initial_props = initial_inst[5];
		if (inst.recycled)
		{
			for (i = 0, len = initial_props.length; i < len; i++)
				inst.properties[i] = initial_props[i];
		}
		else
			inst.properties = initial_props.slice(0);
		this.createRow.push(inst);
		this.hasPendingInstances = true;
		if (layer)
		{
;
			layer.appendToInstanceList(inst, true);
			if (layer.parallaxX !== 1 || layer.parallaxY !== 1)
				type.any_instance_parallaxed = true;
		}
		this.objectcount++;
		if (type.is_contained)
		{
			inst.is_contained = true;
			if (inst.recycled)
				cr.clearArray(inst.siblings);
			else
				inst.siblings = [];			// note: should not include self in siblings
			if (!is_startup_instance && !skip_siblings)	// layout links initial instances
			{
				for (i = 0, len = type.container.length; i < len; i++)
				{
					if (type.container[i] === type)
						continue;
					if (!type.container[i].default_instance)
					{
						return null;
					}
					inst.siblings.push(this.createInstanceFromInit(type.container[i].default_instance, original_layer, false, is_world ? inst.x : sx, is_world ? inst.y : sy, true));
				}
				for (i = 0, len = inst.siblings.length; i < len; i++)
				{
					inst.siblings[i].siblings.push(inst);
					for (j = 0; j < len; j++)
					{
						if (i !== j)
							inst.siblings[i].siblings.push(inst.siblings[j]);
					}
				}
			}
		}
		else
		{
			inst.is_contained = false;
			inst.siblings = null;
		}
		inst.onCreate();
		if (!inst.recycled)
			cr.seal(inst);
		for (i = 0, len = inst.behavior_insts.length; i < len; i++)
		{
			if (inst.behavior_insts[i].postCreate)
				inst.behavior_insts[i].postCreate();
		}
		return inst;
	};
	Runtime.prototype.getLayerByName = function (layer_name)
	{
		var i, len;
		for (i = 0, len = this.running_layout.layers.length; i < len; i++)
		{
			var layer = this.running_layout.layers[i];
			if (cr.equals_nocase(layer.name, layer_name))
				return layer;
		}
		return null;
	};
	Runtime.prototype.getLayerByNumber = function (index)
	{
		index = cr.floor(index);
		if (index < 0)
			index = 0;
		if (index >= this.running_layout.layers.length)
			index = this.running_layout.layers.length - 1;
		return this.running_layout.layers[index];
	};
	Runtime.prototype.getLayer = function (l)
	{
		if (cr.is_number(l))
			return this.getLayerByNumber(l);
		else
			return this.getLayerByName(l.toString());
	};
	Runtime.prototype.clearSol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].getCurrentSol().select_all = true;
		}
	};
	Runtime.prototype.pushCleanSol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].pushCleanSol();
		}
	};
	Runtime.prototype.pushCopySol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].pushCopySol();
		}
	};
	Runtime.prototype.popSol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].popSol();
		}
	};
	Runtime.prototype.updateAllCells = function (type)
	{
		if (!type.any_cell_changed)
			return;		// all instances must already be up-to-date
		var i, len, instances = type.instances;
		for (i = 0, len = instances.length; i < len; ++i)
		{
			instances[i].update_collision_cell();
		}
		var createRow = this.createRow;
		for (i = 0, len = createRow.length; i < len; ++i)
		{
			if (createRow[i].type === type)
				createRow[i].update_collision_cell();
		}
		type.any_cell_changed = false;
	};
	Runtime.prototype.getCollisionCandidates = function (layer, rtype, bbox, candidates)
	{
		var i, len, t;
		var is_parallaxed = (layer ? (layer.parallaxX !== 1 || layer.parallaxY !== 1) : false);
		if (rtype.is_family)
		{
			for (i = 0, len = rtype.members.length; i < len; ++i)
			{
				t = rtype.members[i];
				if (is_parallaxed || t.any_instance_parallaxed)
				{
					cr.appendArray(candidates, t.instances);
				}
				else
				{
					this.updateAllCells(t);
					t.collision_grid.queryRange(bbox, candidates);
				}
			}
		}
		else
		{
			if (is_parallaxed || rtype.any_instance_parallaxed)
			{
				cr.appendArray(candidates, rtype.instances);
			}
			else
			{
				this.updateAllCells(rtype);
				rtype.collision_grid.queryRange(bbox, candidates);
			}
		}
	};
	Runtime.prototype.getTypesCollisionCandidates = function (layer, types, bbox, candidates)
	{
		var i, len;
		for (i = 0, len = types.length; i < len; ++i)
		{
			this.getCollisionCandidates(layer, types[i], bbox, candidates);
		}
	};
	Runtime.prototype.getSolidCollisionCandidates = function (layer, bbox, candidates)
	{
		var solid = this.getSolidBehavior();
		if (!solid)
			return null;
		this.getTypesCollisionCandidates(layer, solid.my_types, bbox, candidates);
	};
	Runtime.prototype.getJumpthruCollisionCandidates = function (layer, bbox, candidates)
	{
		var jumpthru = this.getJumpthruBehavior();
		if (!jumpthru)
			return null;
		this.getTypesCollisionCandidates(layer, jumpthru.my_types, bbox, candidates);
	};
	Runtime.prototype.testAndSelectCanvasPointOverlap = function (type, ptx, pty, inverted)
	{
		var sol = type.getCurrentSol();
		var i, j, inst, len;
		var orblock = this.getCurrentEventStack().current_event.orblock;
		var lx, ly, arr;
		if (sol.select_all)
		{
			if (!inverted)
			{
				sol.select_all = false;
				cr.clearArray(sol.instances);   // clear contents
			}
			for (i = 0, len = type.instances.length; i < len; i++)
			{
				inst = type.instances[i];
				inst.update_bbox();
				lx = inst.layer.canvasToLayer(ptx, pty, true);
				ly = inst.layer.canvasToLayer(ptx, pty, false);
				if (inst.contains_pt(lx, ly))
				{
					if (inverted)
						return false;
					else
						sol.instances.push(inst);
				}
				else if (orblock)
					sol.else_instances.push(inst);
			}
		}
		else
		{
			j = 0;
			arr = (orblock ? sol.else_instances : sol.instances);
			for (i = 0, len = arr.length; i < len; i++)
			{
				inst = arr[i];
				inst.update_bbox();
				lx = inst.layer.canvasToLayer(ptx, pty, true);
				ly = inst.layer.canvasToLayer(ptx, pty, false);
				if (inst.contains_pt(lx, ly))
				{
					if (inverted)
						return false;
					else if (orblock)
						sol.instances.push(inst);
					else
					{
						sol.instances[j] = sol.instances[i];
						j++;
					}
				}
			}
			if (!inverted)
				arr.length = j;
		}
		type.applySolToContainer();
		if (inverted)
			return true;		// did not find anything overlapping
		else
			return sol.hasObjects();
	};
	Runtime.prototype.testOverlap = function (a, b)
	{
		if (!a || !b || a === b || !a.collisionsEnabled || !b.collisionsEnabled)
			return false;
		a.update_bbox();
		b.update_bbox();
		var layera = a.layer;
		var layerb = b.layer;
		var different_layers = (layera !== layerb && (layera.parallaxX !== layerb.parallaxX || layerb.parallaxY !== layerb.parallaxY || layera.scale !== layerb.scale || layera.angle !== layerb.angle || layera.zoomRate !== layerb.zoomRate));
		var i, len, i2, i21, x, y, haspolya, haspolyb, polya, polyb;
		if (!different_layers)	// same layers: easy check
		{
			if (!a.bbox.intersects_rect(b.bbox))
				return false;
			if (!a.bquad.intersects_quad(b.bquad))
				return false;
			if (a.tilemap_exists && b.tilemap_exists)
				return false;
			if (a.tilemap_exists)
				return this.testTilemapOverlap(a, b);
			if (b.tilemap_exists)
				return this.testTilemapOverlap(b, a);
			haspolya = (a.collision_poly && !a.collision_poly.is_empty());
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (!haspolya && !haspolyb)
				return true;
			if (haspolya)
			{
				a.collision_poly.cache_poly(a.width, a.height, a.angle);
				polya = a.collision_poly;
			}
			else
			{
				this.temp_poly.set_from_quad(a.bquad, a.x, a.y, a.width, a.height);
				polya = this.temp_poly;
			}
			if (haspolyb)
			{
				b.collision_poly.cache_poly(b.width, b.height, b.angle);
				polyb = b.collision_poly;
			}
			else
			{
				this.temp_poly.set_from_quad(b.bquad, b.x, b.y, b.width, b.height);
				polyb = this.temp_poly;
			}
			return polya.intersects_poly(polyb, b.x - a.x, b.y - a.y);
		}
		else	// different layers: need to do full translated check
		{
			haspolya = (a.collision_poly && !a.collision_poly.is_empty());
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (haspolya)
			{
				a.collision_poly.cache_poly(a.width, a.height, a.angle);
				this.temp_poly.set_from_poly(a.collision_poly);
			}
			else
			{
				this.temp_poly.set_from_quad(a.bquad, a.x, a.y, a.width, a.height);
			}
			polya = this.temp_poly;
			if (haspolyb)
			{
				b.collision_poly.cache_poly(b.width, b.height, b.angle);
				this.temp_poly2.set_from_poly(b.collision_poly);
			}
			else
			{
				this.temp_poly2.set_from_quad(b.bquad, b.x, b.y, b.width, b.height);
			}
			polyb = this.temp_poly2;
			for (i = 0, len = polya.pts_count; i < len; i++)
			{
				i2 = i * 2;
				i21 = i2 + 1;
				x = polya.pts_cache[i2];
				y = polya.pts_cache[i21];
				polya.pts_cache[i2] = layera.layerToCanvas(x + a.x, y + a.y, true);
				polya.pts_cache[i21] = layera.layerToCanvas(x + a.x, y + a.y, false);
			}
			polya.update_bbox();
			for (i = 0, len = polyb.pts_count; i < len; i++)
			{
				i2 = i * 2;
				i21 = i2 + 1;
				x = polyb.pts_cache[i2];
				y = polyb.pts_cache[i21];
				polyb.pts_cache[i2] = layerb.layerToCanvas(x + b.x, y + b.y, true);
				polyb.pts_cache[i21] = layerb.layerToCanvas(x + b.x, y + b.y, false);
			}
			polyb.update_bbox();
			return polya.intersects_poly(polyb, 0, 0);
		}
	};
	var tmpQuad = new cr.quad();
	var tmpRect = new cr.rect(0, 0, 0, 0);
	var collrect_candidates = [];
	Runtime.prototype.testTilemapOverlap = function (tm, a)
	{
		var i, len, c, rc;
		var bbox = a.bbox;
		var tmx = tm.x;
		var tmy = tm.y;
		tm.getCollisionRectCandidates(bbox, collrect_candidates);
		var collrects = collrect_candidates;
		var haspolya = (a.collision_poly && !a.collision_poly.is_empty());
		for (i = 0, len = collrects.length; i < len; ++i)
		{
			c = collrects[i];
			rc = c.rc;
			if (bbox.intersects_rect_off(rc, tmx, tmy))
			{
				tmpQuad.set_from_rect(rc);
				tmpQuad.offset(tmx, tmy);
				if (tmpQuad.intersects_quad(a.bquad))
				{
					if (haspolya)
					{
						a.collision_poly.cache_poly(a.width, a.height, a.angle);
						if (c.poly)
						{
							if (c.poly.intersects_poly(a.collision_poly, a.x - (tmx + rc.left), a.y - (tmy + rc.top)))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
						else
						{
							this.temp_poly.set_from_quad(tmpQuad, 0, 0, rc.right - rc.left, rc.bottom - rc.top);
							if (this.temp_poly.intersects_poly(a.collision_poly, a.x, a.y))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
					}
					else
					{
						if (c.poly)
						{
							this.temp_poly.set_from_quad(a.bquad, 0, 0, a.width, a.height);
							if (c.poly.intersects_poly(this.temp_poly, -(tmx + rc.left), -(tmy + rc.top)))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
						else
						{
							cr.clearArray(collrect_candidates);
							return true;
						}
					}
				}
			}
		}
		cr.clearArray(collrect_candidates);
		return false;
	};
	Runtime.prototype.testRectOverlap = function (r, b)
	{
		if (!b || !b.collisionsEnabled)
			return false;
		b.update_bbox();
		var layerb = b.layer;
		var haspolyb, polyb;
		if (!b.bbox.intersects_rect(r))
			return false;
		if (b.tilemap_exists)
		{
			b.getCollisionRectCandidates(r, collrect_candidates);
			var collrects = collrect_candidates;
			var i, len, c, tilerc;
			var tmx = b.x;
			var tmy = b.y;
			for (i = 0, len = collrects.length; i < len; ++i)
			{
				c = collrects[i];
				tilerc = c.rc;
				if (r.intersects_rect_off(tilerc, tmx, tmy))
				{
					if (c.poly)
					{
						this.temp_poly.set_from_rect(r, 0, 0);
						if (c.poly.intersects_poly(this.temp_poly, -(tmx + tilerc.left), -(tmy + tilerc.top)))
						{
							cr.clearArray(collrect_candidates);
							return true;
						}
					}
					else
					{
						cr.clearArray(collrect_candidates);
						return true;
					}
				}
			}
			cr.clearArray(collrect_candidates);
			return false;
		}
		else
		{
			tmpQuad.set_from_rect(r);
			if (!b.bquad.intersects_quad(tmpQuad))
				return false;
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (!haspolyb)
				return true;
			b.collision_poly.cache_poly(b.width, b.height, b.angle);
			tmpQuad.offset(-r.left, -r.top);
			this.temp_poly.set_from_quad(tmpQuad, 0, 0, 1, 1);
			return b.collision_poly.intersects_poly(this.temp_poly, r.left - b.x, r.top - b.y);
		}
	};
	Runtime.prototype.testSegmentOverlap = function (x1, y1, x2, y2, b)
	{
		if (!b || !b.collisionsEnabled)
			return false;
		b.update_bbox();
		var layerb = b.layer;
		var haspolyb, polyb;
		tmpRect.set(cr.min(x1, x2), cr.min(y1, y2), cr.max(x1, x2), cr.max(y1, y2));
		if (!b.bbox.intersects_rect(tmpRect))
			return false;
		if (b.tilemap_exists)
		{
			b.getCollisionRectCandidates(tmpRect, collrect_candidates);
			var collrects = collrect_candidates;
			var i, len, c, tilerc;
			var tmx = b.x;
			var tmy = b.y;
			for (i = 0, len = collrects.length; i < len; ++i)
			{
				c = collrects[i];
				tilerc = c.rc;
				if (tmpRect.intersects_rect_off(tilerc, tmx, tmy))
				{
					tmpQuad.set_from_rect(tilerc);
					tmpQuad.offset(tmx, tmy);
					if (tmpQuad.intersects_segment(x1, y1, x2, y2))
					{
						if (c.poly)
						{
							if (c.poly.intersects_segment(tmx + tilerc.left, tmy + tilerc.top, x1, y1, x2, y2))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
						else
						{
							cr.clearArray(collrect_candidates);
							return true;
						}
					}
				}
			}
			cr.clearArray(collrect_candidates);
			return false;
		}
		else
		{
			if (!b.bquad.intersects_segment(x1, y1, x2, y2))
				return false;
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (!haspolyb)
				return true;
			b.collision_poly.cache_poly(b.width, b.height, b.angle);
			return b.collision_poly.intersects_segment(b.x, b.y, x1, y1, x2, y2);
		}
	};
	Runtime.prototype.typeHasBehavior = function (t, b)
	{
		if (!b)
			return false;
		var i, len, j, lenj, f;
		for (i = 0, len = t.behaviors.length; i < len; i++)
		{
			if (t.behaviors[i].behavior instanceof b)
				return true;
		}
		if (!t.is_family)
		{
			for (i = 0, len = t.families.length; i < len; i++)
			{
				f = t.families[i];
				for (j = 0, lenj = f.behaviors.length; j < lenj; j++)
				{
					if (f.behaviors[j].behavior instanceof b)
						return true;
				}
			}
		}
		return false;
	};
	Runtime.prototype.typeHasNoSaveBehavior = function (t)
	{
		return this.typeHasBehavior(t, cr.behaviors.NoSave);
	};
	Runtime.prototype.typeHasPersistBehavior = function (t)
	{
		return this.typeHasBehavior(t, cr.behaviors.Persist);
	};
	Runtime.prototype.getSolidBehavior = function ()
	{
		return this.solidBehavior;
	};
	Runtime.prototype.getJumpthruBehavior = function ()
	{
		return this.jumpthruBehavior;
	};
	var candidates = [];
	Runtime.prototype.testOverlapSolid = function (inst)
	{
		var i, len, s;
		inst.update_bbox();
		this.getSolidCollisionCandidates(inst.layer, inst.bbox, candidates);
		for (i = 0, len = candidates.length; i < len; ++i)
		{
			s = candidates[i];
			if (!s.extra["solidEnabled"])
				continue;
			if (this.testOverlap(inst, s))
			{
				cr.clearArray(candidates);
				return s;
			}
		}
		cr.clearArray(candidates);
		return null;
	};
	Runtime.prototype.testRectOverlapSolid = function (r)
	{
		var i, len, s;
		this.getSolidCollisionCandidates(null, r, candidates);
		for (i = 0, len = candidates.length; i < len; ++i)
		{
			s = candidates[i];
			if (!s.extra["solidEnabled"])
				continue;
			if (this.testRectOverlap(r, s))
			{
				cr.clearArray(candidates);
				return s;
			}
		}
		cr.clearArray(candidates);
		return null;
	};
	var jumpthru_array_ret = [];
	Runtime.prototype.testOverlapJumpThru = function (inst, all)
	{
		var ret = null;
		if (all)
		{
			ret = jumpthru_array_ret;
			cr.clearArray(ret);
		}
		inst.update_bbox();
		this.getJumpthruCollisionCandidates(inst.layer, inst.bbox, candidates);
		var i, len, j;
		for (i = 0, len = candidates.length; i < len; ++i)
		{
			j = candidates[i];
			if (!j.extra["jumpthruEnabled"])
				continue;
			if (this.testOverlap(inst, j))
			{
				if (all)
					ret.push(j);
				else
				{
					cr.clearArray(candidates);
					return j;
				}
			}
		}
		cr.clearArray(candidates);
		return ret;
	};
	Runtime.prototype.pushOutSolid = function (inst, xdir, ydir, dist, include_jumpthrus, specific_jumpthru)
	{
		var push_dist = dist || 50;
		var oldx = inst.x
		var oldy = inst.y;
		var i;
		var last_overlapped = null, secondlast_overlapped = null;
		for (i = 0; i < push_dist; i++)
		{
			inst.x = (oldx + (xdir * i));
			inst.y = (oldy + (ydir * i));
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, last_overlapped))
			{
				last_overlapped = this.testOverlapSolid(inst);
				if (last_overlapped)
					secondlast_overlapped = last_overlapped;
				if (!last_overlapped)
				{
					if (include_jumpthrus)
					{
						if (specific_jumpthru)
							last_overlapped = (this.testOverlap(inst, specific_jumpthru) ? specific_jumpthru : null);
						else
							last_overlapped = this.testOverlapJumpThru(inst);
						if (last_overlapped)
							secondlast_overlapped = last_overlapped;
					}
					if (!last_overlapped)
					{
						if (secondlast_overlapped)
							this.pushInFractional(inst, xdir, ydir, secondlast_overlapped, 16);
						return true;
					}
				}
			}
		}
		inst.x = oldx;
		inst.y = oldy;
		inst.set_bbox_changed();
		return false;
	};
	Runtime.prototype.pushOutSolidAxis = function(inst, xdir, ydir, dist)
	{
		dist = dist || 50;
		var oldX = inst.x;
		var oldY = inst.y;
		var lastOverlapped = null;
		var secondLastOverlapped = null;
		var i, which, sign;
		for (i = 0; i < dist; ++i)
		{
			for (which = 0; which < 2; ++which)
			{
				sign = which * 2 - 1;		// -1 or 1
				inst.x = oldX + (xdir * i * sign);
				inst.y = oldY + (ydir * i * sign);
				inst.set_bbox_changed();
				if (!this.testOverlap(inst, lastOverlapped))
				{
					lastOverlapped = this.testOverlapSolid(inst);
					if (lastOverlapped)
					{
						secondLastOverlapped = lastOverlapped;
					}
					else
					{
						if (secondLastOverlapped)
							this.pushInFractional(inst, xdir * sign, ydir * sign, secondLastOverlapped, 16);
						return true;
					}
				}
			}
		}
		inst.x = oldX;
		inst.y = oldY;
		inst.set_bbox_changed();
		return false;
	};
	Runtime.prototype.pushOut = function (inst, xdir, ydir, dist, otherinst)
	{
		var push_dist = dist || 50;
		var oldx = inst.x
		var oldy = inst.y;
		var i;
		for (i = 0; i < push_dist; i++)
		{
			inst.x = (oldx + (xdir * i));
			inst.y = (oldy + (ydir * i));
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, otherinst))
				return true;
		}
		inst.x = oldx;
		inst.y = oldy;
		inst.set_bbox_changed();
		return false;
	};
	Runtime.prototype.pushInFractional = function (inst, xdir, ydir, obj, limit)
	{
		var divisor = 2;
		var frac;
		var forward = false;
		var overlapping = false;
		var bestx = inst.x;
		var besty = inst.y;
		while (divisor <= limit)
		{
			frac = 1 / divisor;
			divisor *= 2;
			inst.x += xdir * frac * (forward ? 1 : -1);
			inst.y += ydir * frac * (forward ? 1 : -1);
			inst.set_bbox_changed();
			if (this.testOverlap(inst, obj))
			{
				forward = true;
				overlapping = true;
			}
			else
			{
				forward = false;
				overlapping = false;
				bestx = inst.x;
				besty = inst.y;
			}
		}
		if (overlapping)
		{
			inst.x = bestx;
			inst.y = besty;
			inst.set_bbox_changed();
		}
	};
	Runtime.prototype.pushOutSolidNearest = function (inst, max_dist_)
	{
		var max_dist = (cr.is_undefined(max_dist_) ? 100 : max_dist_);
		var dist = 0;
		var oldx = inst.x
		var oldy = inst.y;
		var dir = 0;
		var dx = 0, dy = 0;
		var last_overlapped = this.testOverlapSolid(inst);
		if (!last_overlapped)
			return true;		// already clear of solids
		while (dist <= max_dist)
		{
			switch (dir) {
			case 0:		dx = 0; dy = -1; dist++; break;
			case 1:		dx = 1; dy = -1; break;
			case 2:		dx = 1; dy = 0; break;
			case 3:		dx = 1; dy = 1; break;
			case 4:		dx = 0; dy = 1; break;
			case 5:		dx = -1; dy = 1; break;
			case 6:		dx = -1; dy = 0; break;
			case 7:		dx = -1; dy = -1; break;
			}
			dir = (dir + 1) % 8;
			inst.x = cr.floor(oldx + (dx * dist));
			inst.y = cr.floor(oldy + (dy * dist));
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, last_overlapped))
			{
				last_overlapped = this.testOverlapSolid(inst);
				if (!last_overlapped)
					return true;
			}
		}
		inst.x = oldx;
		inst.y = oldy;
		inst.set_bbox_changed();
		return false;
	};
	Runtime.prototype.registerCollision = function (a, b)
	{
		if (!a.collisionsEnabled || !b.collisionsEnabled)
			return;
		this.registered_collisions.push([a, b]);
	};
	Runtime.prototype.addRegisteredCollisionCandidates = function (inst, otherType, arr)
	{
		var i, len, r, otherInst;
		for (i = 0, len = this.registered_collisions.length; i < len; ++i)
		{
			r = this.registered_collisions[i];
			if (r[0] === inst)
				otherInst = r[1];
			else if (r[1] === inst)
				otherInst = r[0];
			else
				continue;
			if (otherType.is_family)
			{
				if (otherType.members.indexOf(otherType) === -1)
					continue;
			}
			else
			{
				if (otherInst.type !== otherType)
					continue;
			}
			if (arr.indexOf(otherInst) === -1)
				arr.push(otherInst);
		}
	};
	Runtime.prototype.checkRegisteredCollision = function (a, b)
	{
		var i, len, x;
		for (i = 0, len = this.registered_collisions.length; i < len; i++)
		{
			x = this.registered_collisions[i];
			if ((x[0] === a && x[1] === b) || (x[0] === b && x[1] === a))
				return true;
		}
		return false;
	};
	Runtime.prototype.calculateSolidBounceAngle = function(inst, startx, starty, obj)
	{
		var objx = inst.x;
		var objy = inst.y;
		var radius = cr.max(10, cr.distanceTo(startx, starty, objx, objy));
		var startangle = cr.angleTo(startx, starty, objx, objy);
		var firstsolid = obj || this.testOverlapSolid(inst);
		if (!firstsolid)
			return cr.clamp_angle(startangle + cr.PI);
		var cursolid = firstsolid;
		var i, curangle, anticlockwise_free_angle, clockwise_free_angle;
		var increment = cr.to_radians(5);	// 5 degree increments
		for (i = 1; i < 36; i++)
		{
			curangle = startangle - i * increment;
			inst.x = startx + Math.cos(curangle) * radius;
			inst.y = starty + Math.sin(curangle) * radius;
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, cursolid))
			{
				cursolid = obj ? null : this.testOverlapSolid(inst);
				if (!cursolid)
				{
					anticlockwise_free_angle = curangle;
					break;
				}
			}
		}
		if (i === 36)
			anticlockwise_free_angle = cr.clamp_angle(startangle + cr.PI);
		var cursolid = firstsolid;
		for (i = 1; i < 36; i++)
		{
			curangle = startangle + i * increment;
			inst.x = startx + Math.cos(curangle) * radius;
			inst.y = starty + Math.sin(curangle) * radius;
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, cursolid))
			{
				cursolid = obj ? null : this.testOverlapSolid(inst);
				if (!cursolid)
				{
					clockwise_free_angle = curangle;
					break;
				}
			}
		}
		if (i === 36)
			clockwise_free_angle = cr.clamp_angle(startangle + cr.PI);
		inst.x = objx;
		inst.y = objy;
		inst.set_bbox_changed();
		if (clockwise_free_angle === anticlockwise_free_angle)
			return clockwise_free_angle;
		var half_diff = cr.angleDiff(clockwise_free_angle, anticlockwise_free_angle) / 2;
		var normal;
		if (cr.angleClockwise(clockwise_free_angle, anticlockwise_free_angle))
		{
			normal = cr.clamp_angle(anticlockwise_free_angle + half_diff + cr.PI);
		}
		else
		{
			normal = cr.clamp_angle(clockwise_free_angle + half_diff);
		}
;
		var vx = Math.cos(startangle);
		var vy = Math.sin(startangle);
		var nx = Math.cos(normal);
		var ny = Math.sin(normal);
		var v_dot_n = vx * nx + vy * ny;
		var rx = vx - 2 * v_dot_n * nx;
		var ry = vy - 2 * v_dot_n * ny;
		return cr.angleTo(0, 0, rx, ry);
	};
	var triggerSheetIndex = -1;
	Runtime.prototype.trigger = function (method, inst, value /* for fast triggers */)
	{
;
		if (!this.running_layout)
			return false;
		var sheet = this.running_layout.event_sheet;
		if (!sheet)
			return false;     // no event sheet active; nothing to trigger
		var ret = false;
		var r, i, len;
		triggerSheetIndex++;
		var deep_includes = sheet.deep_includes;
		for (i = 0, len = deep_includes.length; i < len; ++i)
		{
			r = this.triggerOnSheet(method, inst, deep_includes[i], value);
			ret = ret || r;
		}
		r = this.triggerOnSheet(method, inst, sheet, value);
		ret = ret || r;
		triggerSheetIndex--;
		return ret;
    };
    Runtime.prototype.triggerOnSheet = function (method, inst, sheet, value)
    {
        var ret = false;
		var i, leni, r, families;
		if (!inst)
		{
			r = this.triggerOnSheetForTypeName(method, inst, "system", sheet, value);
			ret = ret || r;
		}
		else
		{
			r = this.triggerOnSheetForTypeName(method, inst, inst.type.name, sheet, value);
			ret = ret || r;
			families = inst.type.families;
			for (i = 0, leni = families.length; i < leni; ++i)
			{
				r = this.triggerOnSheetForTypeName(method, inst, families[i].name, sheet, value);
				ret = ret || r;
			}
		}
		return ret;             // true if anything got triggered
	};
	Runtime.prototype.triggerOnSheetForTypeName = function (method, inst, type_name, sheet, value)
	{
		var i, leni;
		var ret = false, ret2 = false;
		var trig, index;
		var fasttrigger = (typeof value !== "undefined");
		var triggers = (fasttrigger ? sheet.fasttriggers : sheet.triggers);
		var obj_entry = triggers[type_name];
		if (!obj_entry)
			return ret;
		var triggers_list = null;
		for (i = 0, leni = obj_entry.length; i < leni; ++i)
		{
			if (obj_entry[i].method == method)
			{
				triggers_list = obj_entry[i].evs;
				break;
			}
		}
		if (!triggers_list)
			return ret;
		var triggers_to_fire;
		if (fasttrigger)
		{
			triggers_to_fire = triggers_list[value];
		}
		else
		{
			triggers_to_fire = triggers_list;
		}
		if (!triggers_to_fire)
			return null;
		for (i = 0, leni = triggers_to_fire.length; i < leni; i++)
		{
			trig = triggers_to_fire[i][0];
			index = triggers_to_fire[i][1];
			ret2 = this.executeSingleTrigger(inst, type_name, trig, index);
			ret = ret || ret2;
		}
		return ret;
	};
	Runtime.prototype.executeSingleTrigger = function (inst, type_name, trig, index)
	{
		var i, leni;
		var ret = false;
		this.trigger_depth++;
		var current_event = this.getCurrentEventStack().current_event;
		if (current_event)
			this.pushCleanSol(current_event.solModifiersIncludingParents);
		var isrecursive = (this.trigger_depth > 1);		// calling trigger from inside another trigger
		this.pushCleanSol(trig.solModifiersIncludingParents);
		if (isrecursive)
			this.pushLocalVarStack();
		var event_stack = this.pushEventStack(trig);
		event_stack.current_event = trig;
		if (inst)
		{
			var sol = this.types[type_name].getCurrentSol();
			sol.select_all = false;
			cr.clearArray(sol.instances);
			sol.instances[0] = inst;
			this.types[type_name].applySolToContainer();
		}
		var ok_to_run = true;
		if (trig.parent)
		{
			var temp_parents_arr = event_stack.temp_parents_arr;
			var cur_parent = trig.parent;
			while (cur_parent)
			{
				temp_parents_arr.push(cur_parent);
				cur_parent = cur_parent.parent;
			}
			temp_parents_arr.reverse();
			for (i = 0, leni = temp_parents_arr.length; i < leni; i++)
			{
				if (!temp_parents_arr[i].run_pretrigger())   // parent event failed
				{
					ok_to_run = false;
					break;
				}
			}
		}
		if (ok_to_run)
		{
			this.execcount++;
			if (trig.orblock)
				trig.run_orblocktrigger(index);
			else
				trig.run();
			ret = ret || event_stack.last_event_true;
		}
		this.popEventStack();
		if (isrecursive)
			this.popLocalVarStack();
		this.popSol(trig.solModifiersIncludingParents);
		if (current_event)
			this.popSol(current_event.solModifiersIncludingParents);
		if (this.hasPendingInstances && this.isInOnDestroy === 0 && triggerSheetIndex === 0 && !this.isRunningEvents)
		{
			this.ClearDeathRow();
		}
		this.trigger_depth--;
		return ret;
	};
	Runtime.prototype.getCurrentCondition = function ()
	{
		var evinfo = this.getCurrentEventStack();
		return evinfo.current_event.conditions[evinfo.cndindex];
	};
	Runtime.prototype.getCurrentConditionObjectType = function ()
	{
		var cnd = this.getCurrentCondition();
		return cnd.type;
	};
	Runtime.prototype.isCurrentConditionFirst = function ()
	{
		var evinfo = this.getCurrentEventStack();
		return evinfo.cndindex === 0;
	};
	Runtime.prototype.getCurrentAction = function ()
	{
		var evinfo = this.getCurrentEventStack();
		return evinfo.current_event.actions[evinfo.actindex];
	};
	Runtime.prototype.pushLocalVarStack = function ()
	{
		this.localvar_stack_index++;
		if (this.localvar_stack_index >= this.localvar_stack.length)
			this.localvar_stack.push([]);
	};
	Runtime.prototype.popLocalVarStack = function ()
	{
;
		this.localvar_stack_index--;
	};
	Runtime.prototype.getCurrentLocalVarStack = function ()
	{
		return this.localvar_stack[this.localvar_stack_index];
	};
	Runtime.prototype.pushEventStack = function (cur_event)
	{
		this.event_stack_index++;
		if (this.event_stack_index >= this.event_stack.length)
			this.event_stack.push(new cr.eventStackFrame());
		var ret = this.getCurrentEventStack();
		ret.reset(cur_event);
		return ret;
	};
	Runtime.prototype.popEventStack = function ()
	{
;
		this.event_stack_index--;
	};
	Runtime.prototype.getCurrentEventStack = function ()
	{
		return this.event_stack[this.event_stack_index];
	};
	Runtime.prototype.pushLoopStack = function (name_)
	{
		this.loop_stack_index++;
		if (this.loop_stack_index >= this.loop_stack.length)
		{
			this.loop_stack.push(cr.seal({ name: name_, index: 0, stopped: false }));
		}
		var ret = this.getCurrentLoop();
		ret.name = name_;
		ret.index = 0;
		ret.stopped = false;
		return ret;
	};
	Runtime.prototype.popLoopStack = function ()
	{
;
		this.loop_stack_index--;
	};
	Runtime.prototype.getCurrentLoop = function ()
	{
		return this.loop_stack[this.loop_stack_index];
	};
	Runtime.prototype.getEventVariableByName = function (name, scope)
	{
		var i, leni, j, lenj, sheet, e;
		while (scope)
		{
			for (i = 0, leni = scope.subevents.length; i < leni; i++)
			{
				e = scope.subevents[i];
				if (e instanceof cr.eventvariable && cr.equals_nocase(name, e.name))
					return e;
			}
			scope = scope.parent;
		}
		for (i = 0, leni = this.eventsheets_by_index.length; i < leni; i++)
		{
			sheet = this.eventsheets_by_index[i];
			for (j = 0, lenj = sheet.events.length; j < lenj; j++)
			{
				e = sheet.events[j];
				if (e instanceof cr.eventvariable && cr.equals_nocase(name, e.name))
					return e;
			}
		}
		return null;
	};
	Runtime.prototype.getLayoutBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.layouts_by_index.length; i < len; i++)
		{
			if (this.layouts_by_index[i].sid === sid_)
				return this.layouts_by_index[i];
		}
		return null;
	};
	Runtime.prototype.getObjectTypeBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			if (this.types_by_index[i].sid === sid_)
				return this.types_by_index[i];
		}
		return null;
	};
	Runtime.prototype.getGroupBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.allGroups.length; i < len; i++)
		{
			if (this.allGroups[i].sid === sid_)
				return this.allGroups[i];
		}
		return null;
	};
	Runtime.prototype.doCanvasSnapshot = function (format_, quality_)
	{
		this.snapshotCanvas = [format_, quality_];
		this.redraw = true;		// force redraw so snapshot is always taken
	};
	function IsIndexedDBAvailable()
	{
		try {
			return !!window.indexedDB;
		}
		catch (e)
		{
			return false;
		}
	};
	function makeSaveDb(e)
	{
		var db = e.target.result;
		db.createObjectStore("saves", { keyPath: "slot" });
	};
	function IndexedDB_WriteSlot(slot_, data_, oncomplete_, onerror_)
	{
		try {
			var request = indexedDB.open("_C2SaveStates");
			request.onupgradeneeded = makeSaveDb;
			request.onerror = onerror_;
			request.onsuccess = function (e)
			{
				var db = e.target.result;
				db.onerror = onerror_;
				var transaction = db.transaction(["saves"], "readwrite");
				var objectStore = transaction.objectStore("saves");
				var putReq = objectStore.put({"slot": slot_, "data": data_ });
				putReq.onsuccess = oncomplete_;
			};
		}
		catch (err)
		{
			onerror_(err);
		}
	};
	function IndexedDB_ReadSlot(slot_, oncomplete_, onerror_)
	{
		try {
			var request = indexedDB.open("_C2SaveStates");
			request.onupgradeneeded = makeSaveDb;
			request.onerror = onerror_;
			request.onsuccess = function (e)
			{
				var db = e.target.result;
				db.onerror = onerror_;
				var transaction = db.transaction(["saves"]);
				var objectStore = transaction.objectStore("saves");
				var readReq = objectStore.get(slot_);
				readReq.onsuccess = function (e)
				{
					if (readReq.result)
						oncomplete_(readReq.result["data"]);
					else
						oncomplete_(null);
				};
			};
		}
		catch (err)
		{
			onerror_(err);
		}
	};
	Runtime.prototype.signalContinuousPreview = function ()
	{
		this.signalledContinuousPreview = true;
	};
	function doContinuousPreviewReload()
	{
		cr.logexport("Reloading for continuous preview");
		if (!!window["c2cocoonjs"])
		{
			CocoonJS["App"]["reload"]();
		}
		else
		{
			if (window.location.search.indexOf("continuous") > -1)
				window.location.reload(true);
			else
				window.location = window.location + "?continuous";
		}
	};
	Runtime.prototype.handleSaveLoad = function ()
	{
		var self = this;
		var savingToSlot = this.saveToSlot;
		var savingJson = this.lastSaveJson;
		var loadingFromSlot = this.loadFromSlot;
		var continuous = false;
		if (this.signalledContinuousPreview)
		{
			continuous = true;
			savingToSlot = "__c2_continuouspreview";
			this.signalledContinuousPreview = false;
		}
		if (savingToSlot.length)
		{
			this.ClearDeathRow();
			savingJson = this.saveToJSONString();
			if (IsIndexedDBAvailable() && !this.isCocoonJs)
			{
				IndexedDB_WriteSlot(savingToSlot, savingJson, function ()
				{
					cr.logexport("Saved state to IndexedDB storage (" + savingJson.length + " bytes)");
					self.lastSaveJson = savingJson;
					self.trigger(cr.system_object.prototype.cnds.OnSaveComplete, null);
					self.lastSaveJson = "";
					if (continuous)
						doContinuousPreviewReload();
				}, function (e)
				{
					try {
						localStorage.setItem("__c2save_" + savingToSlot, savingJson);
						cr.logexport("Saved state to WebStorage (" + savingJson.length + " bytes)");
						self.lastSaveJson = savingJson;
						self.trigger(cr.system_object.prototype.cnds.OnSaveComplete, null);
						self.lastSaveJson = "";
						if (continuous)
							doContinuousPreviewReload();
					}
					catch (f)
					{
						cr.logexport("Failed to save game state: " + e + "; " + f);
						self.trigger(cr.system_object.prototype.cnds.OnSaveFailed, null);
					}
				});
			}
			else
			{
				try {
					localStorage.setItem("__c2save_" + savingToSlot, savingJson);
					cr.logexport("Saved state to WebStorage (" + savingJson.length + " bytes)");
					self.lastSaveJson = savingJson;
					this.trigger(cr.system_object.prototype.cnds.OnSaveComplete, null);
					self.lastSaveJson = "";
					if (continuous)
						doContinuousPreviewReload();
				}
				catch (e)
				{
					cr.logexport("Error saving to WebStorage: " + e);
					self.trigger(cr.system_object.prototype.cnds.OnSaveFailed, null);
				}
			}
			this.saveToSlot = "";
			this.loadFromSlot = "";
			this.loadFromJson = null;
		}
		if (loadingFromSlot.length)
		{
			if (IsIndexedDBAvailable() && !this.isCocoonJs)
			{
				IndexedDB_ReadSlot(loadingFromSlot, function (result_)
				{
					if (result_)
					{
						self.loadFromJson = result_;
						cr.logexport("Loaded state from IndexedDB storage (" + self.loadFromJson.length + " bytes)");
					}
					else
					{
						self.loadFromJson = localStorage.getItem("__c2save_" + loadingFromSlot) || "";
						cr.logexport("Loaded state from WebStorage (" + self.loadFromJson.length + " bytes)");
					}
					self.suspendDrawing = false;
					if (!self.loadFromJson)
					{
						self.loadFromJson = null;
						self.trigger(cr.system_object.prototype.cnds.OnLoadFailed, null);
					}
				}, function (e)
				{
					self.loadFromJson = localStorage.getItem("__c2save_" + loadingFromSlot) || "";
					cr.logexport("Loaded state from WebStorage (" + self.loadFromJson.length + " bytes)");
					self.suspendDrawing = false;
					if (!self.loadFromJson)
					{
						self.loadFromJson = null;
						self.trigger(cr.system_object.prototype.cnds.OnLoadFailed, null);
					}
				});
			}
			else
			{
				try {
					this.loadFromJson = localStorage.getItem("__c2save_" + loadingFromSlot) || "";
					cr.logexport("Loaded state from WebStorage (" + this.loadFromJson.length + " bytes)");
				}
				catch (e)
				{
					this.loadFromJson = null;
				}
				this.suspendDrawing = false;
				if (!self.loadFromJson)
				{
					self.loadFromJson = null;
					self.trigger(cr.system_object.prototype.cnds.OnLoadFailed, null);
				}
			}
			this.loadFromSlot = "";
			this.saveToSlot = "";
		}
		if (this.loadFromJson !== null)
		{
			this.ClearDeathRow();
			var ok = this.loadFromJSONString(this.loadFromJson);
			if (ok)
			{
				this.lastSaveJson = this.loadFromJson;
				this.trigger(cr.system_object.prototype.cnds.OnLoadComplete, null);
				this.lastSaveJson = "";
			}
			else
			{
				self.trigger(cr.system_object.prototype.cnds.OnLoadFailed, null);
			}
			this.loadFromJson = null;
		}
	};
	function CopyExtraObject(extra)
	{
		var p, ret = {};
		for (p in extra)
		{
			if (extra.hasOwnProperty(p))
			{
				if (extra[p] instanceof cr.ObjectSet)
					continue;
				if (extra[p] && typeof extra[p].c2userdata !== "undefined")
					continue;
				if (p === "spriteCreatedDestroyCallback")
					continue;
				ret[p] = extra[p];
			}
		}
		return ret;
	};
	Runtime.prototype.saveToJSONString = function()
	{
		var i, len, j, lenj, type, layout, typeobj, g, c, a, v, p;
		var o = {
			"c2save":				true,
			"version":				1,
			"rt": {
				"time":				this.kahanTime.sum,
				"walltime":			this.wallTime.sum,
				"timescale":		this.timescale,
				"tickcount":		this.tickcount,
				"execcount":		this.execcount,
				"next_uid":			this.next_uid,
				"running_layout":	this.running_layout.sid,
				"start_time_offset": (Date.now() - this.start_time)
			},
			"types": {},
			"layouts": {},
			"events": {
				"groups": {},
				"cnds": {},
				"acts": {},
				"vars": {}
			}
		};
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || this.typeHasNoSaveBehavior(type))
				continue;
			typeobj = {
				"instances": []
			};
			if (cr.hasAnyOwnProperty(type.extra))
				typeobj["ex"] = CopyExtraObject(type.extra);
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				typeobj["instances"].push(this.saveInstanceToJSON(type.instances[j]));
			}
			o["types"][type.sid.toString()] = typeobj;
		}
		for (i = 0, len = this.layouts_by_index.length; i < len; i++)
		{
			layout = this.layouts_by_index[i];
			o["layouts"][layout.sid.toString()] = layout.saveToJSON();
		}
		var ogroups = o["events"]["groups"];
		for (i = 0, len = this.allGroups.length; i < len; i++)
		{
			g = this.allGroups[i];
			ogroups[g.sid.toString()] = this.groups_by_name[g.group_name].group_active;
		}
		var ocnds = o["events"]["cnds"];
		for (p in this.cndsBySid)
		{
			if (this.cndsBySid.hasOwnProperty(p))
			{
				c = this.cndsBySid[p];
				if (cr.hasAnyOwnProperty(c.extra))
					ocnds[p] = { "ex": CopyExtraObject(c.extra) };
			}
		}
		var oacts = o["events"]["acts"];
		for (p in this.actsBySid)
		{
			if (this.actsBySid.hasOwnProperty(p))
			{
				a = this.actsBySid[p];
				if (cr.hasAnyOwnProperty(a.extra))
					oacts[p] = { "ex": CopyExtraObject(a.extra) };
			}
		}
		var ovars = o["events"]["vars"];
		for (p in this.varsBySid)
		{
			if (this.varsBySid.hasOwnProperty(p))
			{
				v = this.varsBySid[p];
				if (!v.is_constant && (!v.parent || v.is_static))
					ovars[p] = v.data;
			}
		}
		o["system"] = this.system.saveToJSON();
		return JSON.stringify(o);
	};
	Runtime.prototype.refreshUidMap = function ()
	{
		var i, len, type, j, lenj, inst;
		this.objectsByUid = {};
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				this.objectsByUid[inst.uid.toString()] = inst;
			}
		}
	};
	Runtime.prototype.loadFromJSONString = function (str)
	{
		var o;
		try {
			o = JSON.parse(str);
		}
		catch (e) {
			return false;
		}
		if (!o["c2save"])
			return false;		// probably not a c2 save state
		if (o["version"] > 1)
			return false;		// from future version of c2; assume not compatible
		this.isLoadingState = true;
		var rt = o["rt"];
		this.kahanTime.reset();
		this.kahanTime.sum = rt["time"];
		this.wallTime.reset();
		this.wallTime.sum = rt["walltime"] || 0;
		this.timescale = rt["timescale"];
		this.tickcount = rt["tickcount"];
		this.execcount = rt["execcount"];
		this.start_time = Date.now() - rt["start_time_offset"];
		var layout_sid = rt["running_layout"];
		if (layout_sid !== this.running_layout.sid)
		{
			var changeToLayout = this.getLayoutBySid(layout_sid);
			if (changeToLayout)
				this.doChangeLayout(changeToLayout);
			else
				return;		// layout that was saved on has gone missing (deleted?)
		}
		var i, len, j, lenj, k, lenk, p, type, existing_insts, load_insts, inst, binst, layout, layer, g, iid, t;
		var otypes = o["types"];
		for (p in otypes)
		{
			if (otypes.hasOwnProperty(p))
			{
				type = this.getObjectTypeBySid(parseInt(p, 10));
				if (!type || type.is_family || this.typeHasNoSaveBehavior(type))
					continue;
				if (otypes[p]["ex"])
					type.extra = otypes[p]["ex"];
				else
					cr.wipe(type.extra);
				existing_insts = type.instances;
				load_insts = otypes[p]["instances"];
				for (i = 0, len = cr.min(existing_insts.length, load_insts.length); i < len; i++)
				{
					this.loadInstanceFromJSON(existing_insts[i], load_insts[i]);
				}
				for (i = load_insts.length, len = existing_insts.length; i < len; i++)
					this.DestroyInstance(existing_insts[i]);
				for (i = existing_insts.length, len = load_insts.length; i < len; i++)
				{
					layer = null;
					if (type.plugin.is_world)
					{
						layer = this.running_layout.getLayerBySid(load_insts[i]["w"]["l"]);
						if (!layer)
							continue;
					}
					inst = this.createInstanceFromInit(type.default_instance, layer, false, 0, 0, true);
					this.loadInstanceFromJSON(inst, load_insts[i]);
				}
				type.stale_iids = true;
			}
		}
		this.ClearDeathRow();
		this.refreshUidMap();
		var olayouts = o["layouts"];
		for (p in olayouts)
		{
			if (olayouts.hasOwnProperty(p))
			{
				layout = this.getLayoutBySid(parseInt(p, 10));
				if (!layout)
					continue;		// must've gone missing
				layout.loadFromJSON(olayouts[p]);
			}
		}
		var ogroups = o["events"]["groups"];
		for (p in ogroups)
		{
			if (ogroups.hasOwnProperty(p))
			{
				g = this.getGroupBySid(parseInt(p, 10));
				if (g && this.groups_by_name[g.group_name])
					this.groups_by_name[g.group_name].setGroupActive(ogroups[p]);
			}
		}
		var ocnds = o["events"]["cnds"];
		for (p in this.cndsBySid)
		{
			if (this.cndsBySid.hasOwnProperty(p))
			{
				if (ocnds.hasOwnProperty(p))
				{
					this.cndsBySid[p].extra = ocnds[p]["ex"];
				}
				else
				{
					this.cndsBySid[p].extra = {};
				}
			}
		}
		var oacts = o["events"]["acts"];
		for (p in this.actsBySid)
		{
			if (this.actsBySid.hasOwnProperty(p))
			{
				if (oacts.hasOwnProperty(p))
				{
					this.actsBySid[p].extra = oacts[p]["ex"];
				}
				else
				{
					this.actsBySid[p].extra = {};
				}
			}
		}
		var ovars = o["events"]["vars"];
		for (p in ovars)
		{
			if (ovars.hasOwnProperty(p) && this.varsBySid.hasOwnProperty(p))
			{
				this.varsBySid[p].data = ovars[p];
			}
		}
		this.next_uid = rt["next_uid"];
		this.isLoadingState = false;
		for (i = 0, len = this.fireOnCreateAfterLoad.length; i < len; ++i)
		{
			inst = this.fireOnCreateAfterLoad[i];
			this.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnCreated, inst);
		}
		cr.clearArray(this.fireOnCreateAfterLoad);
		this.system.loadFromJSON(o["system"]);
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || this.typeHasNoSaveBehavior(type))
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				if (type.is_contained)
				{
					iid = inst.get_iid();
					cr.clearArray(inst.siblings);
					for (k = 0, lenk = type.container.length; k < lenk; k++)
					{
						t = type.container[k];
						if (type === t)
							continue;
;
						inst.siblings.push(t.instances[iid]);
					}
				}
				if (inst.afterLoad)
					inst.afterLoad();
				if (inst.behavior_insts)
				{
					for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
					{
						binst = inst.behavior_insts[k];
						if (binst.afterLoad)
							binst.afterLoad();
					}
				}
			}
		}
		this.redraw = true;
		return true;
	};
	Runtime.prototype.saveInstanceToJSON = function(inst, state_only)
	{
		var i, len, world, behinst, et;
		var type = inst.type;
		var plugin = type.plugin;
		var o = {};
		if (state_only)
			o["c2"] = true;		// mark as known json data from Construct 2
		else
			o["uid"] = inst.uid;
		if (cr.hasAnyOwnProperty(inst.extra))
			o["ex"] = CopyExtraObject(inst.extra);
		if (inst.instance_vars && inst.instance_vars.length)
		{
			o["ivs"] = {};
			for (i = 0, len = inst.instance_vars.length; i < len; i++)
			{
				o["ivs"][inst.type.instvar_sids[i].toString()] = inst.instance_vars[i];
			}
		}
		if (plugin.is_world)
		{
			world = {
				"x": inst.x,
				"y": inst.y,
				"w": inst.width,
				"h": inst.height,
				"l": inst.layer.sid,
				"zi": inst.get_zindex()
			};
			if (inst.angle !== 0)
				world["a"] = inst.angle;
			if (inst.opacity !== 1)
				world["o"] = inst.opacity;
			if (inst.hotspotX !== 0.5)
				world["hX"] = inst.hotspotX;
			if (inst.hotspotY !== 0.5)
				world["hY"] = inst.hotspotY;
			if (inst.blend_mode !== 0)
				world["bm"] = inst.blend_mode;
			if (!inst.visible)
				world["v"] = inst.visible;
			if (!inst.collisionsEnabled)
				world["ce"] = inst.collisionsEnabled;
			if (inst.my_timescale !== -1)
				world["mts"] = inst.my_timescale;
			if (type.effect_types.length)
			{
				world["fx"] = [];
				for (i = 0, len = type.effect_types.length; i < len; i++)
				{
					et = type.effect_types[i];
					world["fx"].push({"name": et.name,
									  "active": inst.active_effect_flags[et.index],
									  "params": inst.effect_params[et.index] });
				}
			}
			o["w"] = world;
		}
		if (inst.behavior_insts && inst.behavior_insts.length)
		{
			o["behs"] = {};
			for (i = 0, len = inst.behavior_insts.length; i < len; i++)
			{
				behinst = inst.behavior_insts[i];
				if (behinst.saveToJSON)
					o["behs"][behinst.type.sid.toString()] = behinst.saveToJSON();
			}
		}
		if (inst.saveToJSON)
			o["data"] = inst.saveToJSON();
		return o;
	};
	Runtime.prototype.getInstanceVarIndexBySid = function (type, sid_)
	{
		var i, len;
		for (i = 0, len = type.instvar_sids.length; i < len; i++)
		{
			if (type.instvar_sids[i] === sid_)
				return i;
		}
		return -1;
	};
	Runtime.prototype.getBehaviorIndexBySid = function (inst, sid_)
	{
		var i, len;
		for (i = 0, len = inst.behavior_insts.length; i < len; i++)
		{
			if (inst.behavior_insts[i].type.sid === sid_)
				return i;
		}
		return -1;
	};
	Runtime.prototype.loadInstanceFromJSON = function(inst, o, state_only)
	{
		var p, i, len, iv, oivs, world, fxindex, obehs, behindex, value;
		var oldlayer;
		var type = inst.type;
		var plugin = type.plugin;
		if (state_only)
		{
			if (!o["c2"])
				return;
		}
		else
			inst.uid = o["uid"];
		if (o["ex"])
			inst.extra = o["ex"];
		else
			cr.wipe(inst.extra);
		oivs = o["ivs"];
		if (oivs)
		{
			for (p in oivs)
			{
				if (oivs.hasOwnProperty(p))
				{
					iv = this.getInstanceVarIndexBySid(type, parseInt(p, 10));
					if (iv < 0 || iv >= inst.instance_vars.length)
						continue;		// must've gone missing
					value = oivs[p];
					if (value === null)
						value = NaN;
					inst.instance_vars[iv] = value;
				}
			}
		}
		if (plugin.is_world)
		{
			world = o["w"];
			if (inst.layer.sid !== world["l"])
			{
				oldlayer = inst.layer;
				inst.layer = this.running_layout.getLayerBySid(world["l"]);
				if (inst.layer)
				{
					oldlayer.removeFromInstanceList(inst, true);
					inst.layer.appendToInstanceList(inst, true);
					inst.set_bbox_changed();
					inst.layer.setZIndicesStaleFrom(0);
				}
				else
				{
					inst.layer = oldlayer;
					if (!state_only)
						this.DestroyInstance(inst);
				}
			}
			inst.x = world["x"];
			inst.y = world["y"];
			inst.width = world["w"];
			inst.height = world["h"];
			inst.zindex = world["zi"];
			inst.angle = world.hasOwnProperty("a") ? world["a"] : 0;
			inst.opacity = world.hasOwnProperty("o") ? world["o"] : 1;
			inst.hotspotX = world.hasOwnProperty("hX") ? world["hX"] : 0.5;
			inst.hotspotY = world.hasOwnProperty("hY") ? world["hY"] : 0.5;
			inst.visible = world.hasOwnProperty("v") ? world["v"] : true;
			inst.collisionsEnabled = world.hasOwnProperty("ce") ? world["ce"] : true;
			inst.my_timescale = world.hasOwnProperty("mts") ? world["mts"] : -1;
			inst.blend_mode = world.hasOwnProperty("bm") ? world["bm"] : 0;;
			inst.compositeOp = cr.effectToCompositeOp(inst.blend_mode);
			if (this.gl)
				cr.setGLBlend(inst, inst.blend_mode, this.gl);
			inst.set_bbox_changed();
			if (world.hasOwnProperty("fx"))
			{
				for (i = 0, len = world["fx"].length; i < len; i++)
				{
					fxindex = type.getEffectIndexByName(world["fx"][i]["name"]);
					if (fxindex < 0)
						continue;		// must've gone missing
					inst.active_effect_flags[fxindex] = world["fx"][i]["active"];
					inst.effect_params[fxindex] = world["fx"][i]["params"];
				}
			}
			inst.updateActiveEffects();
		}
		obehs = o["behs"];
		if (obehs)
		{
			for (p in obehs)
			{
				if (obehs.hasOwnProperty(p))
				{
					behindex = this.getBehaviorIndexBySid(inst, parseInt(p, 10));
					if (behindex < 0)
						continue;		// must've gone missing
					inst.behavior_insts[behindex].loadFromJSON(obehs[p]);
				}
			}
		}
		if (o["data"])
			inst.loadFromJSON(o["data"]);
	};
	Runtime.prototype.fetchLocalFileViaCordova = function (filename, successCallback, errorCallback)
	{
		var path = cordova["file"]["applicationDirectory"] + "www/" + filename;
		window["resolveLocalFileSystemURL"](path, function (entry)
		{
			entry.file(successCallback, errorCallback);
		}, errorCallback);
	};
	Runtime.prototype.fetchLocalFileViaCordovaAsText = function (filename, successCallback, errorCallback)
	{
		this.fetchLocalFileViaCordova(filename, function (file)
		{
			var reader = new FileReader();
			reader.onload = function (e)
			{
				successCallback(e.target.result);
			};
			reader.onerror = errorCallback;
			reader.readAsText(file);
		}, errorCallback);
	};
	var queuedArrayBufferReads = [];
	var activeArrayBufferReads = 0;
	var MAX_ARRAYBUFFER_READS = 8;
	Runtime.prototype.maybeStartNextArrayBufferRead = function()
	{
		if (!queuedArrayBufferReads.length)
			return;		// none left
		if (activeArrayBufferReads >= MAX_ARRAYBUFFER_READS)
			return;		// already got maximum number in-flight
		activeArrayBufferReads++;
		var job = queuedArrayBufferReads.shift();
		this.doFetchLocalFileViaCordovaAsArrayBuffer(job.filename, job.successCallback, job.errorCallback);
	};
	Runtime.prototype.fetchLocalFileViaCordovaAsArrayBuffer = function (filename, successCallback_, errorCallback_)
	{
		var self = this;
		queuedArrayBufferReads.push({
			filename: filename,
			successCallback: function (result)
			{
				activeArrayBufferReads--;
				self.maybeStartNextArrayBufferRead();
				successCallback_(result);
			},
			errorCallback: function (err)
			{
				activeArrayBufferReads--;
				self.maybeStartNextArrayBufferRead();
				errorCallback_(err);
			}
		});
		this.maybeStartNextArrayBufferRead();
	};
	Runtime.prototype.doFetchLocalFileViaCordovaAsArrayBuffer = function (filename, successCallback, errorCallback)
	{
		this.fetchLocalFileViaCordova(filename, function (file)
		{
			var reader = new FileReader();
			reader.onload = function (e)
			{
				successCallback(e.target.result);
			};
			reader.readAsArrayBuffer(file);
		}, errorCallback);
	};
	Runtime.prototype.fetchLocalFileViaCordovaAsURL = function (filename, successCallback, errorCallback)
	{
		var blobType = "";
		var lowername = filename.toLowerCase();
		var ext3 = lowername.substr(lowername.length - 4);
		var ext4 = lowername.substr(lowername.length - 5);
		if (ext3 === ".mp4")
			blobType = "video/mp4";
		else if (ext4 === ".webm")
			blobType = "video/webm";		// use video type but hopefully works with audio too
		else if (ext3 === ".m4a")
			blobType = "audio/mp4";
		else if (ext3 === ".mp3")
			blobType = "audio/mpeg";
		this.fetchLocalFileViaCordovaAsArrayBuffer(filename, function (arrayBuffer)
		{
			var blob = new Blob([arrayBuffer], { type: blobType });
			var url = URL.createObjectURL(blob);
			successCallback(url);
		}, errorCallback);
	};
	Runtime.prototype.isAbsoluteUrl = function (url)
	{
		return /^(?:[a-z]+:)?\/\//.test(url) || url.substr(0, 5) === "data:"  || url.substr(0, 5) === "blob:";
	};
	Runtime.prototype.setImageSrc = function (img, src)
	{
		if (this.isWKWebView && !this.isAbsoluteUrl(src))
		{
			this.fetchLocalFileViaCordovaAsURL(src, function (url)
			{
				img.src = url;
			}, function (err)
			{
				alert("Failed to load image: " + err);
			});
		}
		else
		{
			img.src = src;
		}
	};
	Runtime.prototype.setCtxImageSmoothingEnabled = function (ctx, e)
	{
		if (typeof ctx["imageSmoothingEnabled"] !== "undefined")
		{
			ctx["imageSmoothingEnabled"] = e;
		}
		else
		{
			ctx["webkitImageSmoothingEnabled"] = e;
			ctx["mozImageSmoothingEnabled"] = e;
			ctx["msImageSmoothingEnabled"] = e;
		}
	};
	cr.runtime = Runtime;
	cr.createRuntime = function (canvasid)
	{
		return new Runtime(document.getElementById(canvasid));
	};
	cr.createDCRuntime = function (w, h)
	{
		return new Runtime({ "dc": true, "width": w, "height": h });
	};
	window["cr_createRuntime"] = cr.createRuntime;
	window["cr_createDCRuntime"] = cr.createDCRuntime;
	window["createCocoonJSRuntime"] = function ()
	{
		window["c2cocoonjs"] = true;
		var canvas = document.createElement("screencanvas") || document.createElement("canvas");
		canvas.screencanvas = true;
		document.body.appendChild(canvas);
		var rt = new Runtime(canvas);
		window["c2runtime"] = rt;
		window.addEventListener("orientationchange", function () {
			window["c2runtime"]["setSize"](window.innerWidth, window.innerHeight);
		});
		window["c2runtime"]["setSize"](window.innerWidth, window.innerHeight);
		return rt;
	};
	window["createEjectaRuntime"] = function ()
	{
		var canvas = document.getElementById("canvas");
		var rt = new Runtime(canvas);
		window["c2runtime"] = rt;
		window["c2runtime"]["setSize"](window.innerWidth, window.innerHeight);
		return rt;
	};
}());
window["cr_getC2Runtime"] = function()
{
	var canvas = document.getElementById("c2canvas");
	if (canvas)
		return canvas["c2runtime"];
	else if (window["c2runtime"])
		return window["c2runtime"];
	else
		return null;
}
window["cr_getSnapshot"] = function (format_, quality_)
{
	var runtime = window["cr_getC2Runtime"]();
	if (runtime)
		runtime.doCanvasSnapshot(format_, quality_);
}
window["cr_sizeCanvas"] = function(w, h)
{
	if (w === 0 || h === 0)
		return;
	var runtime = window["cr_getC2Runtime"]();
	if (runtime)
		runtime["setSize"](w, h);
}
window["cr_setSuspended"] = function(s)
{
	var runtime = window["cr_getC2Runtime"]();
	if (runtime)
		runtime["setSuspended"](s);
}
;
(function()
{
	function Layout(runtime, m)
	{
		this.runtime = runtime;
		this.event_sheet = null;
		this.scrollX = (this.runtime.original_width / 2);
		this.scrollY = (this.runtime.original_height / 2);
		this.scale = 1.0;
		this.angle = 0;
		this.first_visit = true;
		this.name = m[0];
		this.originalWidth = m[1];
		this.originalHeight = m[2];
		this.width = m[1];
		this.height = m[2];
		this.unbounded_scrolling = m[3];
		this.sheetname = m[4];
		this.sid = m[5];
		var lm = m[6];
		var i, len;
		this.layers = [];
		this.initial_types = [];
		for (i = 0, len = lm.length; i < len; i++)
		{
			var layer = new cr.layer(this, lm[i]);
			layer.number = i;
			cr.seal(layer);
			this.layers.push(layer);
		}
		var im = m[7];
		this.initial_nonworld = [];
		for (i = 0, len = im.length; i < len; i++)
		{
			var inst = im[i];
			var type = this.runtime.types_by_index[inst[1]];
;
			if (!type.default_instance)
				type.default_instance = inst;
			this.initial_nonworld.push(inst);
			if (this.initial_types.indexOf(type) === -1)
				this.initial_types.push(type);
		}
		this.effect_types = [];
		this.active_effect_types = [];
		this.shaders_preserve_opaqueness = true;
		this.effect_params = [];
		for (i = 0, len = m[8].length; i < len; i++)
		{
			this.effect_types.push({
				id: m[8][i][0],
				name: m[8][i][1],
				shaderindex: -1,
				preservesOpaqueness: false,
				active: true,
				index: i
			});
			this.effect_params.push(m[8][i][2].slice(0));
		}
		this.updateActiveEffects();
		this.rcTex = new cr.rect(0, 0, 1, 1);
		this.rcTex2 = new cr.rect(0, 0, 1, 1);
		this.persist_data = {};
	};
	Layout.prototype.saveObjectToPersist = function (inst)
	{
		var sidStr = inst.type.sid.toString();
		if (!this.persist_data.hasOwnProperty(sidStr))
			this.persist_data[sidStr] = [];
		var type_persist = this.persist_data[sidStr];
		type_persist.push(this.runtime.saveInstanceToJSON(inst));
	};
	Layout.prototype.hasOpaqueBottomLayer = function ()
	{
		var layer = this.layers[0];
		return !layer.transparent && layer.opacity === 1.0 && !layer.forceOwnTexture && layer.visible;
	};
	Layout.prototype.updateActiveEffects = function ()
	{
		cr.clearArray(this.active_effect_types);
		this.shaders_preserve_opaqueness = true;
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.active)
			{
				this.active_effect_types.push(et);
				if (!et.preservesOpaqueness)
					this.shaders_preserve_opaqueness = false;
			}
		}
	};
	Layout.prototype.getEffectByName = function (name_)
	{
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.name === name_)
				return et;
		}
		return null;
	};
	var created_instances = [];
	function sort_by_zindex(a, b)
	{
		return a.zindex - b.zindex;
	};
	var first_layout = true;
	Layout.prototype.startRunning = function ()
	{
		if (this.sheetname)
		{
			this.event_sheet = this.runtime.eventsheets[this.sheetname];
;
			this.event_sheet.updateDeepIncludes();
		}
		this.runtime.running_layout = this;
		this.width = this.originalWidth;
		this.height = this.originalHeight;
		this.scrollX = (this.runtime.original_width / 2);
		this.scrollY = (this.runtime.original_height / 2);
		var i, k, len, lenk, type, type_instances, initial_inst, inst, iid, t, s, p, q, type_data, layer;
		for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
		{
			type = this.runtime.types_by_index[i];
			if (type.is_family)
				continue;		// instances are only transferred for their real type
			type_instances = type.instances;
			for (k = 0, lenk = type_instances.length; k < lenk; k++)
			{
				inst = type_instances[k];
				if (inst.layer)
				{
					var num = inst.layer.number;
					if (num >= this.layers.length)
						num = this.layers.length - 1;
					inst.layer = this.layers[num];
					if (inst.layer.instances.indexOf(inst) === -1)
						inst.layer.instances.push(inst);
					inst.layer.zindices_stale = true;
				}
			}
		}
		if (!first_layout)
		{
			for (i = 0, len = this.layers.length; i < len; ++i)
			{
				this.layers[i].instances.sort(sort_by_zindex);
			}
		}
		var layer;
		cr.clearArray(created_instances);
		this.boundScrolling();
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			layer = this.layers[i];
			layer.createInitialInstances();		// fills created_instances
			layer.updateViewport(null);
		}
		var uids_changed = false;
		if (!this.first_visit)
		{
			for (p in this.persist_data)
			{
				if (this.persist_data.hasOwnProperty(p))
				{
					type = this.runtime.getObjectTypeBySid(parseInt(p, 10));
					if (!type || type.is_family || !this.runtime.typeHasPersistBehavior(type))
						continue;
					type_data = this.persist_data[p];
					for (i = 0, len = type_data.length; i < len; i++)
					{
						layer = null;
						if (type.plugin.is_world)
						{
							layer = this.getLayerBySid(type_data[i]["w"]["l"]);
							if (!layer)
								continue;
						}
						inst = this.runtime.createInstanceFromInit(type.default_instance, layer, false, 0, 0, true);
						this.runtime.loadInstanceFromJSON(inst, type_data[i]);
						uids_changed = true;
						created_instances.push(inst);
					}
					cr.clearArray(type_data);
				}
			}
			for (i = 0, len = this.layers.length; i < len; i++)
			{
				this.layers[i].instances.sort(sort_by_zindex);
				this.layers[i].zindices_stale = true;		// in case of duplicates/holes
			}
		}
		if (uids_changed)
		{
			this.runtime.ClearDeathRow();
			this.runtime.refreshUidMap();
		}
		for (i = 0; i < created_instances.length; i++)
		{
			inst = created_instances[i];
			if (!inst.type.is_contained)
				continue;
			iid = inst.get_iid();
			for (k = 0, lenk = inst.type.container.length; k < lenk; k++)
			{
				t = inst.type.container[k];
				if (inst.type === t)
					continue;
				if (t.instances.length > iid)
					inst.siblings.push(t.instances[iid]);
				else
				{
					if (!t.default_instance)
					{
					}
					else
					{
						s = this.runtime.createInstanceFromInit(t.default_instance, inst.layer, true, inst.x, inst.y, true);
						this.runtime.ClearDeathRow();
						t.updateIIDs();
						inst.siblings.push(s);
						created_instances.push(s);		// come back around and link up its own instances too
					}
				}
			}
		}
		for (i = 0, len = this.initial_nonworld.length; i < len; i++)
		{
			initial_inst = this.initial_nonworld[i];
			type = this.runtime.types_by_index[initial_inst[1]];
			if (!type.is_contained)
			{
				inst = this.runtime.createInstanceFromInit(this.initial_nonworld[i], null, true);
			}
;
		}
		this.runtime.changelayout = null;
		this.runtime.ClearDeathRow();
		if (this.runtime.ctx && !this.runtime.isDomFree)
		{
			for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
			{
				t = this.runtime.types_by_index[i];
				if (t.is_family || !t.instances.length || !t.preloadCanvas2D)
					continue;
				t.preloadCanvas2D(this.runtime.ctx);
			}
		}
		/*
		if (this.runtime.glwrap)
		{
			console.log("Estimated VRAM at layout start: " + this.runtime.glwrap.textureCount() + " textures, approx. " + Math.round(this.runtime.glwrap.estimateVRAM() / 1024) + " kb");
		}
		*/
		if (this.runtime.isLoadingState)
		{
			cr.shallowAssignArray(this.runtime.fireOnCreateAfterLoad, created_instances);
		}
		else
		{
			for (i = 0, len = created_instances.length; i < len; i++)
			{
				inst = created_instances[i];
				this.runtime.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnCreated, inst);
			}
		}
		cr.clearArray(created_instances);
		if (!this.runtime.isLoadingState)
		{
			this.runtime.trigger(cr.system_object.prototype.cnds.OnLayoutStart, null);
		}
		this.first_visit = false;
	};
	Layout.prototype.createGlobalNonWorlds = function ()
	{
		var i, k, len, initial_inst, inst, type;
		for (i = 0, k = 0, len = this.initial_nonworld.length; i < len; i++)
		{
			initial_inst = this.initial_nonworld[i];
			type = this.runtime.types_by_index[initial_inst[1]];
			if (type.global)
			{
				if (!type.is_contained)
				{
					inst = this.runtime.createInstanceFromInit(initial_inst, null, true);
				}
			}
			else
			{
				this.initial_nonworld[k] = initial_inst;
				k++;
			}
		}
		cr.truncateArray(this.initial_nonworld, k);
	};
	Layout.prototype.stopRunning = function ()
	{
;
		/*
		if (this.runtime.glwrap)
		{
			console.log("Estimated VRAM at layout end: " + this.runtime.glwrap.textureCount() + " textures, approx. " + Math.round(this.runtime.glwrap.estimateVRAM() / 1024) + " kb");
		}
		*/
		if (!this.runtime.isLoadingState)
		{
			this.runtime.trigger(cr.system_object.prototype.cnds.OnLayoutEnd, null);
		}
		this.runtime.isEndingLayout = true;
		cr.clearArray(this.runtime.system.waits);
		var i, leni, j, lenj;
		var layer_instances, inst, type;
		if (!this.first_visit)
		{
			for (i = 0, leni = this.layers.length; i < leni; i++)
			{
				this.layers[i].updateZIndices();
				layer_instances = this.layers[i].instances;
				for (j = 0, lenj = layer_instances.length; j < lenj; j++)
				{
					inst = layer_instances[j];
					if (!inst.type.global)
					{
						if (this.runtime.typeHasPersistBehavior(inst.type))
							this.saveObjectToPersist(inst);
					}
				}
			}
		}
		for (i = 0, leni = this.layers.length; i < leni; i++)
		{
			layer_instances = this.layers[i].instances;
			for (j = 0, lenj = layer_instances.length; j < lenj; j++)
			{
				inst = layer_instances[j];
				if (!inst.type.global)
				{
					this.runtime.DestroyInstance(inst);
				}
			}
			this.runtime.ClearDeathRow();
			cr.clearArray(layer_instances);
			this.layers[i].zindices_stale = true;
		}
		for (i = 0, leni = this.runtime.types_by_index.length; i < leni; i++)
		{
			type = this.runtime.types_by_index[i];
			if (type.global || type.plugin.is_world || type.plugin.singleglobal || type.is_family)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
				this.runtime.DestroyInstance(type.instances[j]);
			this.runtime.ClearDeathRow();
		}
		first_layout = false;
		this.runtime.isEndingLayout = false;
	};
	var temp_rect = new cr.rect(0, 0, 0, 0);
	Layout.prototype.recreateInitialObjects = function (type, x1, y1, x2, y2)
	{
		temp_rect.set(x1, y1, x2, y2);
		var i, len;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			this.layers[i].recreateInitialObjects(type, temp_rect);
		}
	};
	Layout.prototype.draw = function (ctx)
	{
		var layout_canvas;
		var layout_ctx = ctx;
		var ctx_changed = false;
		var render_offscreen = !this.runtime.fullscreenScalingQuality;
		if (render_offscreen)
		{
			if (!this.runtime.layout_canvas)
			{
				this.runtime.layout_canvas = document.createElement("canvas");
				layout_canvas = this.runtime.layout_canvas;
				layout_canvas.width = this.runtime.draw_width;
				layout_canvas.height = this.runtime.draw_height;
				this.runtime.layout_ctx = layout_canvas.getContext("2d");
				ctx_changed = true;
			}
			layout_canvas = this.runtime.layout_canvas;
			layout_ctx = this.runtime.layout_ctx;
			if (layout_canvas.width !== this.runtime.draw_width)
			{
				layout_canvas.width = this.runtime.draw_width;
				ctx_changed = true;
			}
			if (layout_canvas.height !== this.runtime.draw_height)
			{
				layout_canvas.height = this.runtime.draw_height;
				ctx_changed = true;
			}
			if (ctx_changed)
			{
				this.runtime.setCtxImageSmoothingEnabled(layout_ctx, this.runtime.linearSampling);
			}
		}
		layout_ctx.globalAlpha = 1;
		layout_ctx.globalCompositeOperation = "source-over";
		if (this.runtime.clearBackground && !this.hasOpaqueBottomLayer())
			layout_ctx.clearRect(0, 0, this.runtime.draw_width, this.runtime.draw_height);
		var i, len, l;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			l = this.layers[i];
			if (l.visible && l.opacity > 0 && l.blend_mode !== 11 && (l.instances.length || !l.transparent))
				l.draw(layout_ctx);
			else
				l.updateViewport(null);		// even if not drawing, keep viewport up to date
		}
		if (render_offscreen)
		{
			ctx.drawImage(layout_canvas, 0, 0, this.runtime.width, this.runtime.height);
		}
	};
	Layout.prototype.drawGL_earlyZPass = function (glw)
	{
		glw.setEarlyZPass(true);
		if (!this.runtime.layout_tex)
		{
			this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
		}
		if (this.runtime.layout_tex.c2width !== this.runtime.draw_width || this.runtime.layout_tex.c2height !== this.runtime.draw_height)
		{
			glw.deleteTexture(this.runtime.layout_tex);
			this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
		}
		glw.setRenderingToTexture(this.runtime.layout_tex);
		if (!this.runtime.fullscreenScalingQuality)
		{
			glw.setSize(this.runtime.draw_width, this.runtime.draw_height);
		}
		var i, l;
		for (i = this.layers.length - 1; i >= 0; --i)
		{
			l = this.layers[i];
			if (l.visible && l.opacity === 1 && l.shaders_preserve_opaqueness &&
				l.blend_mode === 0 && (l.instances.length || !l.transparent))
			{
				l.drawGL_earlyZPass(glw);
			}
			else
			{
				l.updateViewport(null);		// even if not drawing, keep viewport up to date
			}
		}
		glw.setEarlyZPass(false);
	};
	Layout.prototype.drawGL = function (glw)
	{
		var render_to_texture = (this.active_effect_types.length > 0 ||
								 this.runtime.uses_background_blending ||
								 !this.runtime.fullscreenScalingQuality ||
								 this.runtime.enableFrontToBack);
		if (render_to_texture)
		{
			if (!this.runtime.layout_tex)
			{
				this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			if (this.runtime.layout_tex.c2width !== this.runtime.draw_width || this.runtime.layout_tex.c2height !== this.runtime.draw_height)
			{
				glw.deleteTexture(this.runtime.layout_tex);
				this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			glw.setRenderingToTexture(this.runtime.layout_tex);
			if (!this.runtime.fullscreenScalingQuality)
			{
				glw.setSize(this.runtime.draw_width, this.runtime.draw_height);
			}
		}
		else
		{
			if (this.runtime.layout_tex)
			{
				glw.setRenderingToTexture(null);
				glw.deleteTexture(this.runtime.layout_tex);
				this.runtime.layout_tex = null;
			}
		}
		if (this.runtime.clearBackground && !this.hasOpaqueBottomLayer())
			glw.clear(0, 0, 0, 0);
		var i, len, l;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			l = this.layers[i];
			if (l.visible && l.opacity > 0 && (l.instances.length || !l.transparent))
				l.drawGL(glw);
			else
				l.updateViewport(null);		// even if not drawing, keep viewport up to date
		}
		if (render_to_texture)
		{
			if (this.active_effect_types.length === 0 ||
				(this.active_effect_types.length === 1 && this.runtime.fullscreenScalingQuality))
			{
				if (this.active_effect_types.length === 1)
				{
					var etindex = this.active_effect_types[0].index;
					glw.switchProgram(this.active_effect_types[0].shaderindex);
					glw.setProgramParameters(null,								// backTex
											 1.0 / this.runtime.draw_width,		// pixelWidth
											 1.0 / this.runtime.draw_height,	// pixelHeight
											 0.0, 0.0,							// destStart
											 1.0, 1.0,							// destEnd
											 this.scale,						// layerScale
											 this.angle,						// layerAngle
											 0.0, 0.0,							// viewOrigin
											 this.runtime.draw_width / 2, this.runtime.draw_height / 2,	// scrollPos
											 this.runtime.kahanTime.sum,		// seconds
											 this.effect_params[etindex]);		// fx parameters
					if (glw.programIsAnimated(this.active_effect_types[0].shaderindex))
						this.runtime.redraw = true;
				}
				else
					glw.switchProgram(0);
				if (!this.runtime.fullscreenScalingQuality)
				{
					glw.setSize(this.runtime.width, this.runtime.height);
				}
				glw.setRenderingToTexture(null);				// to backbuffer
				glw.setDepthTestEnabled(false);					// ignore depth buffer, copy full texture
				glw.setOpacity(1);
				glw.setTexture(this.runtime.layout_tex);
				glw.setAlphaBlend();
				glw.resetModelView();
				glw.updateModelView();
				var halfw = this.runtime.width / 2;
				var halfh = this.runtime.height / 2;
				glw.quad(-halfw, halfh, halfw, halfh, halfw, -halfh, -halfw, -halfh);
				glw.setTexture(null);
				glw.setDepthTestEnabled(true);					// turn depth test back on
			}
			else
			{
				this.renderEffectChain(glw, null, null, null);
			}
		}
	};
	Layout.prototype.getRenderTarget = function()
	{
		if (this.active_effect_types.length > 0 ||
				this.runtime.uses_background_blending ||
				!this.runtime.fullscreenScalingQuality ||
				this.runtime.enableFrontToBack)
		{
			return this.runtime.layout_tex;
		}
		else
		{
			return null;
		}
	};
	Layout.prototype.getMinLayerScale = function ()
	{
		var m = this.layers[0].getScale();
		var i, len, l;
		for (i = 1, len = this.layers.length; i < len; i++)
		{
			l = this.layers[i];
			if (l.parallaxX === 0 && l.parallaxY === 0)
				continue;
			if (l.getScale() < m)
				m = l.getScale();
		}
		return m;
	};
	Layout.prototype.scrollToX = function (x)
	{
		if (!this.unbounded_scrolling)
		{
			var widthBoundary = (this.runtime.draw_width * (1 / this.getMinLayerScale()) / 2);
			if (x > this.width - widthBoundary)
				x = this.width - widthBoundary;
			if (x < widthBoundary)
				x = widthBoundary;
		}
		if (this.scrollX !== x)
		{
			this.scrollX = x;
			this.runtime.redraw = true;
		}
	};
	Layout.prototype.scrollToY = function (y)
	{
		if (!this.unbounded_scrolling)
		{
			var heightBoundary = (this.runtime.draw_height * (1 / this.getMinLayerScale()) / 2);
			if (y > this.height - heightBoundary)
				y = this.height - heightBoundary;
			if (y < heightBoundary)
				y = heightBoundary;
		}
		if (this.scrollY !== y)
		{
			this.scrollY = y;
			this.runtime.redraw = true;
		}
	};
	Layout.prototype.boundScrolling = function ()
	{
		this.scrollToX(this.scrollX);
		this.scrollToY(this.scrollY);
	};
	Layout.prototype.renderEffectChain = function (glw, layer, inst, rendertarget)
	{
		var active_effect_types = inst ?
							inst.active_effect_types :
							layer ?
								layer.active_effect_types :
								this.active_effect_types;
		var layerScale = 1, layerAngle = 0, viewOriginLeft = 0, viewOriginTop = 0, viewOriginRight = this.runtime.draw_width, viewOriginBottom = this.runtime.draw_height;
		if (inst)
		{
			layerScale = inst.layer.getScale();
			layerAngle = inst.layer.getAngle();
			viewOriginLeft = inst.layer.viewLeft;
			viewOriginTop = inst.layer.viewTop;
			viewOriginRight = inst.layer.viewRight;
			viewOriginBottom = inst.layer.viewBottom;
		}
		else if (layer)
		{
			layerScale = layer.getScale();
			layerAngle = layer.getAngle();
			viewOriginLeft = layer.viewLeft;
			viewOriginTop = layer.viewTop;
			viewOriginRight = layer.viewRight;
			viewOriginBottom = layer.viewBottom;
		}
		var fx_tex = this.runtime.fx_tex;
		var i, len, last, temp, fx_index = 0, other_fx_index = 1;
		var y, h;
		var windowWidth = this.runtime.draw_width;
		var windowHeight = this.runtime.draw_height;
		var halfw = windowWidth / 2;
		var halfh = windowHeight / 2;
		var rcTex = layer ? layer.rcTex : this.rcTex;
		var rcTex2 = layer ? layer.rcTex2 : this.rcTex2;
		var screenleft = 0, clearleft = 0;
		var screentop = 0, cleartop = 0;
		var screenright = windowWidth, clearright = windowWidth;
		var screenbottom = windowHeight, clearbottom = windowHeight;
		var boxExtendHorizontal = 0;
		var boxExtendVertical = 0;
		var inst_layer_angle = inst ? inst.layer.getAngle() : 0;
		if (inst)
		{
			for (i = 0, len = active_effect_types.length; i < len; i++)
			{
				boxExtendHorizontal += glw.getProgramBoxExtendHorizontal(active_effect_types[i].shaderindex);
				boxExtendVertical += glw.getProgramBoxExtendVertical(active_effect_types[i].shaderindex);
			}
			var bbox = inst.bbox;
			screenleft = layer.layerToCanvas(bbox.left, bbox.top, true, true);
			screentop = layer.layerToCanvas(bbox.left, bbox.top, false, true);
			screenright = layer.layerToCanvas(bbox.right, bbox.bottom, true, true);
			screenbottom = layer.layerToCanvas(bbox.right, bbox.bottom, false, true);
			if (inst_layer_angle !== 0)
			{
				var screentrx = layer.layerToCanvas(bbox.right, bbox.top, true, true);
				var screentry = layer.layerToCanvas(bbox.right, bbox.top, false, true);
				var screenblx = layer.layerToCanvas(bbox.left, bbox.bottom, true, true);
				var screenbly = layer.layerToCanvas(bbox.left, bbox.bottom, false, true);
				temp = Math.min(screenleft, screenright, screentrx, screenblx);
				screenright = Math.max(screenleft, screenright, screentrx, screenblx);
				screenleft = temp;
				temp = Math.min(screentop, screenbottom, screentry, screenbly);
				screenbottom = Math.max(screentop, screenbottom, screentry, screenbly);
				screentop = temp;
			}
			screenleft -= boxExtendHorizontal;
			screentop -= boxExtendVertical;
			screenright += boxExtendHorizontal;
			screenbottom += boxExtendVertical;
			rcTex2.left = screenleft / windowWidth;
			rcTex2.top = 1 - screentop / windowHeight;
			rcTex2.right = screenright / windowWidth;
			rcTex2.bottom = 1 - screenbottom / windowHeight;
			clearleft = screenleft = cr.floor(screenleft);
			cleartop = screentop = cr.floor(screentop);
			clearright = screenright = cr.ceil(screenright);
			clearbottom = screenbottom = cr.ceil(screenbottom);
			clearleft -= boxExtendHorizontal;
			cleartop -= boxExtendVertical;
			clearright += boxExtendHorizontal;
			clearbottom += boxExtendVertical;
			if (screenleft < 0)					screenleft = 0;
			if (screentop < 0)					screentop = 0;
			if (screenright > windowWidth)		screenright = windowWidth;
			if (screenbottom > windowHeight)	screenbottom = windowHeight;
			if (clearleft < 0)					clearleft = 0;
			if (cleartop < 0)					cleartop = 0;
			if (clearright > windowWidth)		clearright = windowWidth;
			if (clearbottom > windowHeight)		clearbottom = windowHeight;
			rcTex.left = screenleft / windowWidth;
			rcTex.top = 1 - screentop / windowHeight;
			rcTex.right = screenright / windowWidth;
			rcTex.bottom = 1 - screenbottom / windowHeight;
		}
		else
		{
			rcTex.left = rcTex2.left = 0;
			rcTex.top = rcTex2.top = 0;
			rcTex.right = rcTex2.right = 1;
			rcTex.bottom = rcTex2.bottom = 1;
		}
		var pre_draw = (inst && (glw.programUsesDest(active_effect_types[0].shaderindex) || boxExtendHorizontal !== 0 || boxExtendVertical !== 0 || inst.opacity !== 1 || inst.type.plugin.must_predraw)) || (layer && !inst && layer.opacity !== 1);
		glw.setAlphaBlend();
		if (pre_draw)
		{
			if (!fx_tex[fx_index])
			{
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			if (fx_tex[fx_index].c2width !== windowWidth || fx_tex[fx_index].c2height !== windowHeight)
			{
				glw.deleteTexture(fx_tex[fx_index]);
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			glw.switchProgram(0);
			glw.setRenderingToTexture(fx_tex[fx_index]);
			h = clearbottom - cleartop;
			y = (windowHeight - cleartop) - h;
			glw.clearRect(clearleft, y, clearright - clearleft, h);
			if (inst)
			{
				inst.drawGL(glw);
			}
			else
			{
				glw.setTexture(this.runtime.layer_tex);
				glw.setOpacity(layer.opacity);
				glw.resetModelView();
				glw.translate(-halfw, -halfh);
				glw.updateModelView();
				glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
			}
			rcTex2.left = rcTex2.top = 0;
			rcTex2.right = rcTex2.bottom = 1;
			if (inst)
			{
				temp = rcTex.top;
				rcTex.top = rcTex.bottom;
				rcTex.bottom = temp;
			}
			fx_index = 1;
			other_fx_index = 0;
		}
		glw.setOpacity(1);
		var last = active_effect_types.length - 1;
		var post_draw = glw.programUsesCrossSampling(active_effect_types[last].shaderindex) ||
						(!layer && !inst && !this.runtime.fullscreenScalingQuality);
		var etindex = 0;
		for (i = 0, len = active_effect_types.length; i < len; i++)
		{
			if (!fx_tex[fx_index])
			{
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			if (fx_tex[fx_index].c2width !== windowWidth || fx_tex[fx_index].c2height !== windowHeight)
			{
				glw.deleteTexture(fx_tex[fx_index]);
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			glw.switchProgram(active_effect_types[i].shaderindex);
			etindex = active_effect_types[i].index;
			if (glw.programIsAnimated(active_effect_types[i].shaderindex))
				this.runtime.redraw = true;
			if (i == 0 && !pre_draw)
			{
				glw.setRenderingToTexture(fx_tex[fx_index]);
				h = clearbottom - cleartop;
				y = (windowHeight - cleartop) - h;
				glw.clearRect(clearleft, y, clearright - clearleft, h);
				if (inst)
				{
					var pixelWidth;
					var pixelHeight;
					if (inst.curFrame && inst.curFrame.texture_img)
					{
						var img = inst.curFrame.texture_img;
						pixelWidth = 1.0 / img.width;
						pixelHeight = 1.0 / img.height;
					}
					else
					{
						pixelWidth = 1.0 / inst.width;
						pixelHeight = 1.0 / inst.height;
					}
					glw.setProgramParameters(rendertarget,					// backTex
											 pixelWidth,
											 pixelHeight,
											 rcTex2.left, rcTex2.top,		// destStart
											 rcTex2.right, rcTex2.bottom,	// destEnd
											 layerScale,
											 layerAngle,
											 viewOriginLeft, viewOriginTop,
											 (viewOriginLeft + viewOriginRight) / 2, (viewOriginTop + viewOriginBottom) / 2,
											 this.runtime.kahanTime.sum,
											 inst.effect_params[etindex]);	// fx params
					inst.drawGL(glw);
				}
				else
				{
					glw.setProgramParameters(rendertarget,					// backTex
											 1.0 / windowWidth,				// pixelWidth
											 1.0 / windowHeight,			// pixelHeight
											 0.0, 0.0,						// destStart
											 1.0, 1.0,						// destEnd
											 layerScale,
											 layerAngle,
											 viewOriginLeft, viewOriginTop,
											 (viewOriginLeft + viewOriginRight) / 2, (viewOriginTop + viewOriginBottom) / 2,
											 this.runtime.kahanTime.sum,
											 layer ?						// fx params
												layer.effect_params[etindex] :
												this.effect_params[etindex]);
					glw.setTexture(layer ? this.runtime.layer_tex : this.runtime.layout_tex);
					glw.resetModelView();
					glw.translate(-halfw, -halfh);
					glw.updateModelView();
					glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
				}
				rcTex2.left = rcTex2.top = 0;
				rcTex2.right = rcTex2.bottom = 1;
				if (inst && !post_draw)
				{
					temp = screenbottom;
					screenbottom = screentop;
					screentop = temp;
				}
			}
			else
			{
				glw.setProgramParameters(rendertarget,						// backTex
										 1.0 / windowWidth,					// pixelWidth
										 1.0 / windowHeight,				// pixelHeight
										 rcTex2.left, rcTex2.top,			// destStart
										 rcTex2.right, rcTex2.bottom,		// destEnd
										 layerScale,
										 layerAngle,
										 viewOriginLeft, viewOriginTop,
										 (viewOriginLeft + viewOriginRight) / 2, (viewOriginTop + viewOriginBottom) / 2,
										 this.runtime.kahanTime.sum,
										 inst ?								// fx params
											inst.effect_params[etindex] :
											layer ?
												layer.effect_params[etindex] :
												this.effect_params[etindex]);
				glw.setTexture(null);
				if (i === last && !post_draw)
				{
					if (inst)
						glw.setBlend(inst.srcBlend, inst.destBlend);
					else if (layer)
						glw.setBlend(layer.srcBlend, layer.destBlend);
					glw.setRenderingToTexture(rendertarget);
				}
				else
				{
					glw.setRenderingToTexture(fx_tex[fx_index]);
					h = clearbottom - cleartop;
					y = (windowHeight - cleartop) - h;
					glw.clearRect(clearleft, y, clearright - clearleft, h);
				}
				glw.setTexture(fx_tex[other_fx_index]);
				glw.resetModelView();
				glw.translate(-halfw, -halfh);
				glw.updateModelView();
				glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
				if (i === last && !post_draw)
					glw.setTexture(null);
			}
			fx_index = (fx_index === 0 ? 1 : 0);
			other_fx_index = (fx_index === 0 ? 1 : 0);		// will be opposite to fx_index since it was just assigned
		}
		if (post_draw)
		{
			glw.switchProgram(0);
			if (inst)
				glw.setBlend(inst.srcBlend, inst.destBlend);
			else if (layer)
				glw.setBlend(layer.srcBlend, layer.destBlend);
			else
			{
				if (!this.runtime.fullscreenScalingQuality)
				{
					glw.setSize(this.runtime.width, this.runtime.height);
					halfw = this.runtime.width / 2;
					halfh = this.runtime.height / 2;
					screenleft = 0;
					screentop = 0;
					screenright = this.runtime.width;
					screenbottom = this.runtime.height;
				}
			}
			glw.setRenderingToTexture(rendertarget);
			glw.setTexture(fx_tex[other_fx_index]);
			glw.resetModelView();
			glw.translate(-halfw, -halfh);
			glw.updateModelView();
			if (inst && active_effect_types.length === 1 && !pre_draw)
				glw.quadTex(screenleft, screentop, screenright, screentop, screenright, screenbottom, screenleft, screenbottom, rcTex);
			else
				glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
			glw.setTexture(null);
		}
	};
	Layout.prototype.getLayerBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			if (this.layers[i].sid === sid_)
				return this.layers[i];
		}
		return null;
	};
	Layout.prototype.saveToJSON = function ()
	{
		var i, len, layer, et;
		var o = {
			"sx": this.scrollX,
			"sy": this.scrollY,
			"s": this.scale,
			"a": this.angle,
			"w": this.width,
			"h": this.height,
			"fv": this.first_visit,			// added r127
			"persist": this.persist_data,
			"fx": [],
			"layers": {}
		};
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			o["fx"].push({"name": et.name, "active": et.active, "params": this.effect_params[et.index] });
		}
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			layer = this.layers[i];
			o["layers"][layer.sid.toString()] = layer.saveToJSON();
		}
		return o;
	};
	Layout.prototype.loadFromJSON = function (o)
	{
		var i, j, len, fx, p, layer;
		this.scrollX = o["sx"];
		this.scrollY = o["sy"];
		this.scale = o["s"];
		this.angle = o["a"];
		this.width = o["w"];
		this.height = o["h"];
		this.persist_data = o["persist"];
		if (typeof o["fv"] !== "undefined")
			this.first_visit = o["fv"];
		var ofx = o["fx"];
		for (i = 0, len = ofx.length; i < len; i++)
		{
			fx = this.getEffectByName(ofx[i]["name"]);
			if (!fx)
				continue;		// must've gone missing
			fx.active = ofx[i]["active"];
			this.effect_params[fx.index] = ofx[i]["params"];
		}
		this.updateActiveEffects();
		var olayers = o["layers"];
		for (p in olayers)
		{
			if (olayers.hasOwnProperty(p))
			{
				layer = this.getLayerBySid(parseInt(p, 10));
				if (!layer)
					continue;		// must've gone missing
				layer.loadFromJSON(olayers[p]);
			}
		}
	};
	cr.layout = Layout;
	function Layer(layout, m)
	{
		this.layout = layout;
		this.runtime = layout.runtime;
		this.instances = [];        // running instances
		this.scale = 1.0;
		this.angle = 0;
		this.disableAngle = false;
		this.tmprect = new cr.rect(0, 0, 0, 0);
		this.tmpquad = new cr.quad();
		this.viewLeft = 0;
		this.viewRight = 0;
		this.viewTop = 0;
		this.viewBottom = 0;
		this.zindices_stale = false;
		this.zindices_stale_from = -1;		// first index that has changed, or -1 if no bound
		this.clear_earlyz_index = 0;
		this.name = m[0];
		this.index = m[1];
		this.sid = m[2];
		this.visible = m[3];		// initially visible
		this.background_color = m[4];
		this.transparent = m[5];
		this.parallaxX = m[6];
		this.parallaxY = m[7];
		this.opacity = m[8];
		this.forceOwnTexture = m[9];
		this.useRenderCells = m[10];
		this.zoomRate = m[11];
		this.blend_mode = m[12];
		this.effect_fallback = m[13];
		this.compositeOp = "source-over";
		this.srcBlend = 0;
		this.destBlend = 0;
		this.render_grid = null;
		this.last_render_list = alloc_arr();
		this.render_list_stale = true;
		this.last_render_cells = new cr.rect(0, 0, -1, -1);
		this.cur_render_cells = new cr.rect(0, 0, -1, -1);
		if (this.useRenderCells)
		{
			this.render_grid = new cr.RenderGrid(this.runtime.original_width, this.runtime.original_height);
		}
		this.render_offscreen = false;
		var im = m[14];
		var i, len;
		this.startup_initial_instances = [];		// for restoring initial_instances after load
		this.initial_instances = [];
		this.created_globals = [];		// global object UIDs already created - for save/load to avoid recreating
		for (i = 0, len = im.length; i < len; i++)
		{
			var inst = im[i];
			var type = this.runtime.types_by_index[inst[1]];
;
			if (!type.default_instance)
			{
				type.default_instance = inst;
				type.default_layerindex = this.index;
			}
			this.initial_instances.push(inst);
			if (this.layout.initial_types.indexOf(type) === -1)
				this.layout.initial_types.push(type);
		}
		cr.shallowAssignArray(this.startup_initial_instances, this.initial_instances);
		this.effect_types = [];
		this.active_effect_types = [];
		this.shaders_preserve_opaqueness = true;
		this.effect_params = [];
		for (i = 0, len = m[15].length; i < len; i++)
		{
			this.effect_types.push({
				id: m[15][i][0],
				name: m[15][i][1],
				shaderindex: -1,
				preservesOpaqueness: false,
				active: true,
				index: i
			});
			this.effect_params.push(m[15][i][2].slice(0));
		}
		this.updateActiveEffects();
		this.rcTex = new cr.rect(0, 0, 1, 1);
		this.rcTex2 = new cr.rect(0, 0, 1, 1);
	};
	Layer.prototype.updateActiveEffects = function ()
	{
		cr.clearArray(this.active_effect_types);
		this.shaders_preserve_opaqueness = true;
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.active)
			{
				this.active_effect_types.push(et);
				if (!et.preservesOpaqueness)
					this.shaders_preserve_opaqueness = false;
			}
		}
	};
	Layer.prototype.getEffectByName = function (name_)
	{
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.name === name_)
				return et;
		}
		return null;
	};
	Layer.prototype.createInitialInstances = function ()
	{
		var i, k, len, inst, initial_inst, type, keep, hasPersistBehavior;
		for (i = 0, k = 0, len = this.initial_instances.length; i < len; i++)
		{
			initial_inst = this.initial_instances[i];
			type = this.runtime.types_by_index[initial_inst[1]];
;
			hasPersistBehavior = this.runtime.typeHasPersistBehavior(type);
			keep = true;
			if (!hasPersistBehavior || this.layout.first_visit)
			{
				inst = this.runtime.createInstanceFromInit(initial_inst, this, true);
				if (!inst)
					continue;		// may have skipped creation due to fallback effect "destroy"
				created_instances.push(inst);
				if (inst.type.global)
				{
					keep = false;
					this.created_globals.push(inst.uid);
				}
			}
			if (keep)
			{
				this.initial_instances[k] = this.initial_instances[i];
				k++;
			}
		}
		this.initial_instances.length = k;
		this.runtime.ClearDeathRow();		// flushes creation row so IIDs will be correct
		if (!this.runtime.glwrap && this.effect_types.length)	// no WebGL renderer and shaders used
			this.blend_mode = this.effect_fallback;				// use fallback blend mode
		this.compositeOp = cr.effectToCompositeOp(this.blend_mode);
		if (this.runtime.gl)
			cr.setGLBlend(this, this.blend_mode, this.runtime.gl);
		this.render_list_stale = true;
	};
	Layer.prototype.recreateInitialObjects = function (only_type, rc)
	{
		var i, len, initial_inst, type, wm, x, y, inst, j, lenj, s;
		var types_by_index = this.runtime.types_by_index;
		var only_type_is_family = only_type.is_family;
		var only_type_members = only_type.members;
		for (i = 0, len = this.initial_instances.length; i < len; ++i)
		{
			initial_inst = this.initial_instances[i];
			wm = initial_inst[0];
			x = wm[0];
			y = wm[1];
			if (!rc.contains_pt(x, y))
				continue;		// not in the given area
			type = types_by_index[initial_inst[1]];
			if (type !== only_type)
			{
				if (only_type_is_family)
				{
					if (only_type_members.indexOf(type) < 0)
						continue;
				}
				else
					continue;		// only_type is not a family, and the initial inst type does not match
			}
			inst = this.runtime.createInstanceFromInit(initial_inst, this, false);
			this.runtime.isInOnDestroy++;
			this.runtime.trigger(Object.getPrototypeOf(type.plugin).cnds.OnCreated, inst);
			if (inst.is_contained)
			{
				for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
				{
					s = inst.siblings[i];
					this.runtime.trigger(Object.getPrototypeOf(s.type.plugin).cnds.OnCreated, s);
				}
			}
			this.runtime.isInOnDestroy--;
		}
	};
	Layer.prototype.removeFromInstanceList = function (inst, remove_from_grid)
	{
		var index = cr.fastIndexOf(this.instances, inst);
		if (index < 0)
			return;		// not found
		if (remove_from_grid && this.useRenderCells && inst.rendercells && inst.rendercells.right >= inst.rendercells.left)
		{
			inst.update_bbox();											// make sure actually in its current rendercells
			this.render_grid.update(inst, inst.rendercells, null);		// no new range provided - remove only
			inst.rendercells.set(0, 0, -1, -1);							// set to invalid state to indicate not inserted
		}
		if (index === this.instances.length - 1)
			this.instances.pop();
		else
		{
			cr.arrayRemove(this.instances, index);
			this.setZIndicesStaleFrom(index);
		}
		this.render_list_stale = true;
	};
	Layer.prototype.appendToInstanceList = function (inst, add_to_grid)
	{
;
		inst.zindex = this.instances.length;
		this.instances.push(inst);
		if (add_to_grid && this.useRenderCells && inst.rendercells)
		{
			inst.set_bbox_changed();		// will cause immediate update and new insertion to grid
		}
		this.render_list_stale = true;
	};
	Layer.prototype.prependToInstanceList = function (inst, add_to_grid)
	{
;
		this.instances.unshift(inst);
		this.setZIndicesStaleFrom(0);
		if (add_to_grid && this.useRenderCells && inst.rendercells)
		{
			inst.set_bbox_changed();		// will cause immediate update and new insertion to grid
		}
	};
	Layer.prototype.moveInstanceAdjacent = function (inst, other, isafter)
	{
;
		var myZ = inst.get_zindex();
		var insertZ = other.get_zindex();
		cr.arrayRemove(this.instances, myZ);
		if (myZ < insertZ)
			insertZ--;
		if (isafter)
			insertZ++;
		if (insertZ === this.instances.length)
			this.instances.push(inst);
		else
			this.instances.splice(insertZ, 0, inst);
		this.setZIndicesStaleFrom(myZ < insertZ ? myZ : insertZ);
	};
	Layer.prototype.setZIndicesStaleFrom = function (index)
	{
		if (this.zindices_stale_from === -1)			// not yet set
			this.zindices_stale_from = index;
		else if (index < this.zindices_stale_from)		// determine minimum z index affected
			this.zindices_stale_from = index;
		this.zindices_stale = true;
		this.render_list_stale = true;
	};
	Layer.prototype.updateZIndices = function ()
	{
		if (!this.zindices_stale)
			return;
		if (this.zindices_stale_from === -1)
			this.zindices_stale_from = 0;
		var i, len, inst;
		if (this.useRenderCells)
		{
			for (i = this.zindices_stale_from, len = this.instances.length; i < len; ++i)
			{
				inst = this.instances[i];
				inst.zindex = i;
				this.render_grid.markRangeChanged(inst.rendercells);
			}
		}
		else
		{
			for (i = this.zindices_stale_from, len = this.instances.length; i < len; ++i)
			{
				this.instances[i].zindex = i;
			}
		}
		this.zindices_stale = false;
		this.zindices_stale_from = -1;
	};
	Layer.prototype.getScale = function (include_aspect)
	{
		return this.getNormalScale() * (this.runtime.fullscreenScalingQuality || include_aspect ? this.runtime.aspect_scale : 1);
	};
	Layer.prototype.getNormalScale = function ()
	{
		return ((this.scale * this.layout.scale) - 1) * this.zoomRate + 1;
	};
	Layer.prototype.getAngle = function ()
	{
		if (this.disableAngle)
			return 0;
		return cr.clamp_angle(this.layout.angle + this.angle);
	};
	var arr_cache = [];
	function alloc_arr()
	{
		if (arr_cache.length)
			return arr_cache.pop();
		else
			return [];
	}
	function free_arr(a)
	{
		cr.clearArray(a);
		arr_cache.push(a);
	};
	function mergeSortedZArrays(a, b, out)
	{
		var i = 0, j = 0, k = 0, lena = a.length, lenb = b.length, ai, bj;
		out.length = lena + lenb;
		for ( ; i < lena && j < lenb; ++k)
		{
			ai = a[i];
			bj = b[j];
			if (ai.zindex < bj.zindex)
			{
				out[k] = ai;
				++i;
			}
			else
			{
				out[k] = bj;
				++j;
			}
		}
		for ( ; i < lena; ++i, ++k)
			out[k] = a[i];
		for ( ; j < lenb; ++j, ++k)
			out[k] = b[j];
	};
	var next_arr = [];
	function mergeAllSortedZArrays_pass(arr, first_pass)
	{
		var i, len, arr1, arr2, out;
		for (i = 0, len = arr.length; i < len - 1; i += 2)
		{
			arr1 = arr[i];
			arr2 = arr[i+1];
			out = alloc_arr();
			mergeSortedZArrays(arr1, arr2, out);
			if (!first_pass)
			{
				free_arr(arr1);
				free_arr(arr2);
			}
			next_arr.push(out);
		}
		if (len % 2 === 1)
		{
			if (first_pass)
			{
				arr1 = alloc_arr();
				cr.shallowAssignArray(arr1, arr[len - 1]);
				next_arr.push(arr1);
			}
			else
			{
				next_arr.push(arr[len - 1]);
			}
		}
		cr.shallowAssignArray(arr, next_arr);
		cr.clearArray(next_arr);
	};
	function mergeAllSortedZArrays(arr)
	{
		var first_pass = true;
		while (arr.length > 1)
		{
			mergeAllSortedZArrays_pass(arr, first_pass);
			first_pass = false;
		}
		return arr[0];
	};
	var render_arr = [];
	Layer.prototype.getRenderCellInstancesToDraw = function ()
	{
;
		this.updateZIndices();
		this.render_grid.queryRange(this.viewLeft, this.viewTop, this.viewRight, this.viewBottom, render_arr);
		if (!render_arr.length)
			return alloc_arr();
		if (render_arr.length === 1)
		{
			var a = alloc_arr();
			cr.shallowAssignArray(a, render_arr[0]);
			cr.clearArray(render_arr);
			return a;
		}
		var draw_list = mergeAllSortedZArrays(render_arr);
		cr.clearArray(render_arr);
		return draw_list;
	};
	Layer.prototype.draw = function (ctx)
	{
		this.render_offscreen = (this.forceOwnTexture || this.opacity !== 1.0 || this.blend_mode !== 0);
		var layer_canvas = this.runtime.canvas;
		var layer_ctx = ctx;
		var ctx_changed = false;
		if (this.render_offscreen)
		{
			if (!this.runtime.layer_canvas)
			{
				this.runtime.layer_canvas = document.createElement("canvas");
;
				layer_canvas = this.runtime.layer_canvas;
				layer_canvas.width = this.runtime.draw_width;
				layer_canvas.height = this.runtime.draw_height;
				this.runtime.layer_ctx = layer_canvas.getContext("2d");
;
				ctx_changed = true;
			}
			layer_canvas = this.runtime.layer_canvas;
			layer_ctx = this.runtime.layer_ctx;
			if (layer_canvas.width !== this.runtime.draw_width)
			{
				layer_canvas.width = this.runtime.draw_width;
				ctx_changed = true;
			}
			if (layer_canvas.height !== this.runtime.draw_height)
			{
				layer_canvas.height = this.runtime.draw_height;
				ctx_changed = true;
			}
			if (ctx_changed)
			{
				this.runtime.setCtxImageSmoothingEnabled(layer_ctx, this.runtime.linearSampling);
			}
			if (this.transparent)
				layer_ctx.clearRect(0, 0, this.runtime.draw_width, this.runtime.draw_height);
		}
		layer_ctx.globalAlpha = 1;
		layer_ctx.globalCompositeOperation = "source-over";
		if (!this.transparent)
		{
			layer_ctx.fillStyle = "rgb(" + this.background_color[0] + "," + this.background_color[1] + "," + this.background_color[2] + ")";
			layer_ctx.fillRect(0, 0, this.runtime.draw_width, this.runtime.draw_height);
		}
		layer_ctx.save();
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, layer_ctx);
		var myscale = this.getScale();
		layer_ctx.scale(myscale, myscale);
		layer_ctx.translate(-px, -py);
		var instances_to_draw;
		if (this.useRenderCells)
		{
			this.cur_render_cells.left = this.render_grid.XToCell(this.viewLeft);
			this.cur_render_cells.top = this.render_grid.YToCell(this.viewTop);
			this.cur_render_cells.right = this.render_grid.XToCell(this.viewRight);
			this.cur_render_cells.bottom = this.render_grid.YToCell(this.viewBottom);
			if (this.render_list_stale || !this.cur_render_cells.equals(this.last_render_cells))
			{
				free_arr(this.last_render_list);
				instances_to_draw = this.getRenderCellInstancesToDraw();
				this.render_list_stale = false;
				this.last_render_cells.copy(this.cur_render_cells);
			}
			else
				instances_to_draw = this.last_render_list;
		}
		else
			instances_to_draw = this.instances;
		var i, len, inst, last_inst = null;
		for (i = 0, len = instances_to_draw.length; i < len; ++i)
		{
			inst = instances_to_draw[i];
			if (inst === last_inst)
				continue;
			this.drawInstance(inst, layer_ctx);
			last_inst = inst;
		}
		if (this.useRenderCells)
			this.last_render_list = instances_to_draw;
		layer_ctx.restore();
		if (this.render_offscreen)
		{
			ctx.globalCompositeOperation = this.compositeOp;
			ctx.globalAlpha = this.opacity;
			ctx.drawImage(layer_canvas, 0, 0);
		}
	};
	Layer.prototype.drawInstance = function(inst, layer_ctx)
	{
		if (!inst.visible || inst.width === 0 || inst.height === 0)
			return;
		inst.update_bbox();
		var bbox = inst.bbox;
		if (bbox.right < this.viewLeft || bbox.bottom < this.viewTop || bbox.left > this.viewRight || bbox.top > this.viewBottom)
			return;
		layer_ctx.globalCompositeOperation = inst.compositeOp;
		inst.draw(layer_ctx);
	};
	Layer.prototype.updateViewport = function (ctx)
	{
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, ctx);
	};
	Layer.prototype.rotateViewport = function (px, py, ctx)
	{
		var myscale = this.getScale();
		this.viewLeft = px;
		this.viewTop = py;
		this.viewRight = px + (this.runtime.draw_width * (1 / myscale));
		this.viewBottom = py + (this.runtime.draw_height * (1 / myscale));
		var temp;
		if (this.viewLeft > this.viewRight)
		{
			temp = this.viewLeft;
			this.viewLeft = this.viewRight;
			this.viewRight = temp;
		}
		if (this.viewTop > this.viewBottom)
		{
			temp = this.viewTop;
			this.viewTop = this.viewBottom;
			this.viewBottom = temp;
		}
		var myAngle = this.getAngle();
		if (myAngle !== 0)
		{
			if (ctx)
			{
				ctx.translate(this.runtime.draw_width / 2, this.runtime.draw_height / 2);
				ctx.rotate(-myAngle);
				ctx.translate(this.runtime.draw_width / -2, this.runtime.draw_height / -2);
			}
			this.tmprect.set(this.viewLeft, this.viewTop, this.viewRight, this.viewBottom);
			this.tmprect.offset((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
			this.tmpquad.set_from_rotated_rect(this.tmprect, myAngle);
			this.tmpquad.bounding_box(this.tmprect);
			this.tmprect.offset((this.viewLeft + this.viewRight) / 2, (this.viewTop + this.viewBottom) / 2);
			this.viewLeft = this.tmprect.left;
			this.viewTop = this.tmprect.top;
			this.viewRight = this.tmprect.right;
			this.viewBottom = this.tmprect.bottom;
		}
	}
	Layer.prototype.drawGL_earlyZPass = function (glw)
	{
		var windowWidth = this.runtime.draw_width;
		var windowHeight = this.runtime.draw_height;
		var shaderindex = 0;
		var etindex = 0;
		this.render_offscreen = this.forceOwnTexture;
		if (this.render_offscreen)
		{
			if (!this.runtime.layer_tex)
			{
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			if (this.runtime.layer_tex.c2width !== this.runtime.draw_width || this.runtime.layer_tex.c2height !== this.runtime.draw_height)
			{
				glw.deleteTexture(this.runtime.layer_tex);
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			glw.setRenderingToTexture(this.runtime.layer_tex);
		}
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, null);
		var myscale = this.getScale();
		glw.resetModelView();
		glw.scale(myscale, myscale);
		glw.rotateZ(-this.getAngle());
		glw.translate((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
		glw.updateModelView();
		var instances_to_draw;
		if (this.useRenderCells)
		{
			this.cur_render_cells.left = this.render_grid.XToCell(this.viewLeft);
			this.cur_render_cells.top = this.render_grid.YToCell(this.viewTop);
			this.cur_render_cells.right = this.render_grid.XToCell(this.viewRight);
			this.cur_render_cells.bottom = this.render_grid.YToCell(this.viewBottom);
			if (this.render_list_stale || !this.cur_render_cells.equals(this.last_render_cells))
			{
				free_arr(this.last_render_list);
				instances_to_draw = this.getRenderCellInstancesToDraw();
				this.render_list_stale = false;
				this.last_render_cells.copy(this.cur_render_cells);
			}
			else
				instances_to_draw = this.last_render_list;
		}
		else
			instances_to_draw = this.instances;
		var i, inst, last_inst = null;
		for (i = instances_to_draw.length - 1; i >= 0; --i)
		{
			inst = instances_to_draw[i];
			if (inst === last_inst)
				continue;
			this.drawInstanceGL_earlyZPass(instances_to_draw[i], glw);
			last_inst = inst;
		}
		if (this.useRenderCells)
			this.last_render_list = instances_to_draw;
		if (!this.transparent)
		{
			this.clear_earlyz_index = this.runtime.earlyz_index++;
			glw.setEarlyZIndex(this.clear_earlyz_index);
			glw.setColorFillMode(1, 1, 1, 1);
			glw.fullscreenQuad();		// fill remaining space in depth buffer with current Z value
			glw.restoreEarlyZMode();
		}
	};
	Layer.prototype.drawGL = function (glw)
	{
		var windowWidth = this.runtime.draw_width;
		var windowHeight = this.runtime.draw_height;
		var shaderindex = 0;
		var etindex = 0;
		this.render_offscreen = (this.forceOwnTexture || this.opacity !== 1.0 || this.active_effect_types.length > 0 || this.blend_mode !== 0);
		if (this.render_offscreen)
		{
			if (!this.runtime.layer_tex)
			{
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			if (this.runtime.layer_tex.c2width !== this.runtime.draw_width || this.runtime.layer_tex.c2height !== this.runtime.draw_height)
			{
				glw.deleteTexture(this.runtime.layer_tex);
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			glw.setRenderingToTexture(this.runtime.layer_tex);
			if (this.transparent)
				glw.clear(0, 0, 0, 0);
		}
		if (!this.transparent)
		{
			if (this.runtime.enableFrontToBack)
			{
				glw.setEarlyZIndex(this.clear_earlyz_index);
				glw.setColorFillMode(this.background_color[0] / 255, this.background_color[1] / 255, this.background_color[2] / 255, 1);
				glw.fullscreenQuad();
				glw.setTextureFillMode();
			}
			else
			{
				glw.clear(this.background_color[0] / 255, this.background_color[1] / 255, this.background_color[2] / 255, 1);
			}
		}
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, null);
		var myscale = this.getScale();
		glw.resetModelView();
		glw.scale(myscale, myscale);
		glw.rotateZ(-this.getAngle());
		glw.translate((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
		glw.updateModelView();
		var instances_to_draw;
		if (this.useRenderCells)
		{
			this.cur_render_cells.left = this.render_grid.XToCell(this.viewLeft);
			this.cur_render_cells.top = this.render_grid.YToCell(this.viewTop);
			this.cur_render_cells.right = this.render_grid.XToCell(this.viewRight);
			this.cur_render_cells.bottom = this.render_grid.YToCell(this.viewBottom);
			if (this.render_list_stale || !this.cur_render_cells.equals(this.last_render_cells))
			{
				free_arr(this.last_render_list);
				instances_to_draw = this.getRenderCellInstancesToDraw();
				this.render_list_stale = false;
				this.last_render_cells.copy(this.cur_render_cells);
			}
			else
				instances_to_draw = this.last_render_list;
		}
		else
			instances_to_draw = this.instances;
		var i, len, inst, last_inst = null;
		for (i = 0, len = instances_to_draw.length; i < len; ++i)
		{
			inst = instances_to_draw[i];
			if (inst === last_inst)
				continue;
			this.drawInstanceGL(instances_to_draw[i], glw);
			last_inst = inst;
		}
		if (this.useRenderCells)
			this.last_render_list = instances_to_draw;
		if (this.render_offscreen)
		{
			shaderindex = this.active_effect_types.length ? this.active_effect_types[0].shaderindex : 0;
			etindex = this.active_effect_types.length ? this.active_effect_types[0].index : 0;
			if (this.active_effect_types.length === 0 || (this.active_effect_types.length === 1 &&
				!glw.programUsesCrossSampling(shaderindex) && this.opacity === 1))
			{
				if (this.active_effect_types.length === 1)
				{
					glw.switchProgram(shaderindex);
					glw.setProgramParameters(this.layout.getRenderTarget(),		// backTex
											 1.0 / this.runtime.draw_width,		// pixelWidth
											 1.0 / this.runtime.draw_height,	// pixelHeight
											 0.0, 0.0,							// destStart
											 1.0, 1.0,							// destEnd
											 myscale,							// layerScale
											 this.getAngle(),
											 this.viewLeft, this.viewTop,
											 (this.viewLeft + this.viewRight) / 2, (this.viewTop + this.viewBottom) / 2,
											 this.runtime.kahanTime.sum,
											 this.effect_params[etindex]);		// fx parameters
					if (glw.programIsAnimated(shaderindex))
						this.runtime.redraw = true;
				}
				else
					glw.switchProgram(0);
				glw.setRenderingToTexture(this.layout.getRenderTarget());
				glw.setOpacity(this.opacity);
				glw.setTexture(this.runtime.layer_tex);
				glw.setBlend(this.srcBlend, this.destBlend);
				glw.resetModelView();
				glw.updateModelView();
				var halfw = this.runtime.draw_width / 2;
				var halfh = this.runtime.draw_height / 2;
				glw.quad(-halfw, halfh, halfw, halfh, halfw, -halfh, -halfw, -halfh);
				glw.setTexture(null);
			}
			else
			{
				this.layout.renderEffectChain(glw, this, null, this.layout.getRenderTarget());
			}
		}
	};
	Layer.prototype.drawInstanceGL = function (inst, glw)
	{
;
		if (!inst.visible || inst.width === 0 || inst.height === 0)
			return;
		inst.update_bbox();
		var bbox = inst.bbox;
		if (bbox.right < this.viewLeft || bbox.bottom < this.viewTop || bbox.left > this.viewRight || bbox.top > this.viewBottom)
			return;
		glw.setEarlyZIndex(inst.earlyz_index);
		if (inst.uses_shaders)
		{
			this.drawInstanceWithShadersGL(inst, glw);
		}
		else
		{
			glw.switchProgram(0);		// un-set any previously set shader
			glw.setBlend(inst.srcBlend, inst.destBlend);
			inst.drawGL(glw);
		}
	};
	Layer.prototype.drawInstanceGL_earlyZPass = function (inst, glw)
	{
;
		if (!inst.visible || inst.width === 0 || inst.height === 0)
			return;
		inst.update_bbox();
		var bbox = inst.bbox;
		if (bbox.right < this.viewLeft || bbox.bottom < this.viewTop || bbox.left > this.viewRight || bbox.top > this.viewBottom)
			return;
		inst.earlyz_index = this.runtime.earlyz_index++;
		if (inst.blend_mode !== 0 || inst.opacity !== 1 || !inst.shaders_preserve_opaqueness || !inst.drawGL_earlyZPass)
			return;
		glw.setEarlyZIndex(inst.earlyz_index);
		inst.drawGL_earlyZPass(glw);
	};
	Layer.prototype.drawInstanceWithShadersGL = function (inst, glw)
	{
		var shaderindex = inst.active_effect_types[0].shaderindex;
		var etindex = inst.active_effect_types[0].index;
		var myscale = this.getScale();
		if (inst.active_effect_types.length === 1 && !glw.programUsesCrossSampling(shaderindex) &&
			!glw.programExtendsBox(shaderindex) && ((!inst.angle && !inst.layer.getAngle()) || !glw.programUsesDest(shaderindex)) &&
			inst.opacity === 1 && !inst.type.plugin.must_predraw)
		{
			glw.switchProgram(shaderindex);
			glw.setBlend(inst.srcBlend, inst.destBlend);
			if (glw.programIsAnimated(shaderindex))
				this.runtime.redraw = true;
			var destStartX = 0, destStartY = 0, destEndX = 0, destEndY = 0;
			if (glw.programUsesDest(shaderindex))
			{
				var bbox = inst.bbox;
				var screenleft = this.layerToCanvas(bbox.left, bbox.top, true, true);
				var screentop = this.layerToCanvas(bbox.left, bbox.top, false, true);
				var screenright = this.layerToCanvas(bbox.right, bbox.bottom, true, true);
				var screenbottom = this.layerToCanvas(bbox.right, bbox.bottom, false, true);
				destStartX = screenleft / windowWidth;
				destStartY = 1 - screentop / windowHeight;
				destEndX = screenright / windowWidth;
				destEndY = 1 - screenbottom / windowHeight;
			}
			var pixelWidth;
			var pixelHeight;
			if (inst.curFrame && inst.curFrame.texture_img)
			{
				var img = inst.curFrame.texture_img;
				pixelWidth = 1.0 / img.width;
				pixelHeight = 1.0 / img.height;
			}
			else
			{
				pixelWidth = 1.0 / inst.width;
				pixelHeight = 1.0 / inst.height;
			}
			glw.setProgramParameters(this.render_offscreen ? this.runtime.layer_tex : this.layout.getRenderTarget(), // backTex
									 pixelWidth,
									 pixelHeight,
									 destStartX, destStartY,
									 destEndX, destEndY,
									 myscale,
									 this.getAngle(),
									 this.viewLeft, this.viewTop,
									 (this.viewLeft + this.viewRight) / 2, (this.viewTop + this.viewBottom) / 2,
									 this.runtime.kahanTime.sum,
									 inst.effect_params[etindex]);
			inst.drawGL(glw);
		}
		else
		{
			this.layout.renderEffectChain(glw, this, inst, this.render_offscreen ? this.runtime.layer_tex : this.layout.getRenderTarget());
			glw.resetModelView();
			glw.scale(myscale, myscale);
			glw.rotateZ(-this.getAngle());
			glw.translate((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
			glw.updateModelView();
		}
	};
	Layer.prototype.canvasToLayer = function (ptx, pty, getx, using_draw_area)
	{
		var multiplier = this.runtime.devicePixelRatio;
		if (this.runtime.isRetina)
		{
			ptx *= multiplier;
			pty *= multiplier;
		}
		var ox = this.runtime.parallax_x_origin;
		var oy = this.runtime.parallax_y_origin;
		var par_x = ((this.layout.scrollX - ox) * this.parallaxX) + ox;
		var par_y = ((this.layout.scrollY - oy) * this.parallaxY) + oy;
		var x = par_x;
		var y = par_y;
		var invScale = 1 / this.getScale(!using_draw_area);
		if (using_draw_area)
		{
			x -= (this.runtime.draw_width * invScale) / 2;
			y -= (this.runtime.draw_height * invScale) / 2;
		}
		else
		{
			x -= (this.runtime.width * invScale) / 2;
			y -= (this.runtime.height * invScale) / 2;
		}
		x += ptx * invScale;
		y += pty * invScale;
		var a = this.getAngle();
		if (a !== 0)
		{
			x -= par_x;
			y -= par_y;
			var cosa = Math.cos(a);
			var sina = Math.sin(a);
			var x_temp = (x * cosa) - (y * sina);
			y = (y * cosa) + (x * sina);
			x = x_temp;
			x += par_x;
			y += par_y;
		}
		return getx ? x : y;
	};
	Layer.prototype.layerToCanvas = function (ptx, pty, getx, using_draw_area)
	{
		var ox = this.runtime.parallax_x_origin;
		var oy = this.runtime.parallax_y_origin;
		var par_x = ((this.layout.scrollX - ox) * this.parallaxX) + ox;
		var par_y = ((this.layout.scrollY - oy) * this.parallaxY) + oy;
		var x = par_x;
		var y = par_y;
		var a = this.getAngle();
		if (a !== 0)
		{
			ptx -= par_x;
			pty -= par_y;
			var cosa = Math.cos(-a);
			var sina = Math.sin(-a);
			var x_temp = (ptx * cosa) - (pty * sina);
			pty = (pty * cosa) + (ptx * sina);
			ptx = x_temp;
			ptx += par_x;
			pty += par_y;
		}
		var invScale = 1 / this.getScale(!using_draw_area);
		if (using_draw_area)
		{
			x -= (this.runtime.draw_width * invScale) / 2;
			y -= (this.runtime.draw_height * invScale) / 2;
		}
		else
		{
			x -= (this.runtime.width * invScale) / 2;
			y -= (this.runtime.height * invScale) / 2;
		}
		x = (ptx - x) / invScale;
		y = (pty - y) / invScale;
		var multiplier = this.runtime.devicePixelRatio;
		if (this.runtime.isRetina && !using_draw_area)
		{
			x /= multiplier;
			y /= multiplier;
		}
		return getx ? x : y;
	};
	Layer.prototype.rotatePt = function (x_, y_, getx)
	{
		if (this.getAngle() === 0)
			return getx ? x_ : y_;
		var nx = this.layerToCanvas(x_, y_, true);
		var ny = this.layerToCanvas(x_, y_, false);
		this.disableAngle = true;
		var px = this.canvasToLayer(nx, ny, true);
		var py = this.canvasToLayer(nx, ny, true);
		this.disableAngle = false;
		return getx ? px : py;
	};
	Layer.prototype.saveToJSON = function ()
	{
		var i, len, et;
		var o = {
			"s": this.scale,
			"a": this.angle,
			"vl": this.viewLeft,
			"vt": this.viewTop,
			"vr": this.viewRight,
			"vb": this.viewBottom,
			"v": this.visible,
			"bc": this.background_color,
			"t": this.transparent,
			"px": this.parallaxX,
			"py": this.parallaxY,
			"o": this.opacity,
			"zr": this.zoomRate,
			"fx": [],
			"cg": this.created_globals,		// added r197; list of global UIDs already created
			"instances": []
		};
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			o["fx"].push({"name": et.name, "active": et.active, "params": this.effect_params[et.index] });
		}
		return o;
	};
	Layer.prototype.loadFromJSON = function (o)
	{
		var i, j, len, p, inst, fx;
		this.scale = o["s"];
		this.angle = o["a"];
		this.viewLeft = o["vl"];
		this.viewTop = o["vt"];
		this.viewRight = o["vr"];
		this.viewBottom = o["vb"];
		this.visible = o["v"];
		this.background_color = o["bc"];
		this.transparent = o["t"];
		this.parallaxX = o["px"];
		this.parallaxY = o["py"];
		this.opacity = o["o"];
		this.zoomRate = o["zr"];
		this.created_globals = o["cg"] || [];		// added r197
		cr.shallowAssignArray(this.initial_instances, this.startup_initial_instances);
		var temp_set = new cr.ObjectSet();
		for (i = 0, len = this.created_globals.length; i < len; ++i)
			temp_set.add(this.created_globals[i]);
		for (i = 0, j = 0, len = this.initial_instances.length; i < len; ++i)
		{
			if (!temp_set.contains(this.initial_instances[i][2]))		// UID in element 2
			{
				this.initial_instances[j] = this.initial_instances[i];
				++j;
			}
		}
		cr.truncateArray(this.initial_instances, j);
		var ofx = o["fx"];
		for (i = 0, len = ofx.length; i < len; i++)
		{
			fx = this.getEffectByName(ofx[i]["name"]);
			if (!fx)
				continue;		// must've gone missing
			fx.active = ofx[i]["active"];
			this.effect_params[fx.index] = ofx[i]["params"];
		}
		this.updateActiveEffects();
		this.instances.sort(sort_by_zindex);
		this.zindices_stale = true;
	};
	cr.layer = Layer;
}());
;
(function()
{
	var allUniqueSolModifiers = [];
	function testSolsMatch(arr1, arr2)
	{
		var i, len = arr1.length;
		switch (len) {
		case 0:
			return true;
		case 1:
			return arr1[0] === arr2[0];
		case 2:
			return arr1[0] === arr2[0] && arr1[1] === arr2[1];
		default:
			for (i = 0; i < len; i++)
			{
				if (arr1[i] !== arr2[i])
					return false;
			}
			return true;
		}
	};
	function solArraySorter(t1, t2)
	{
		return t1.index - t2.index;
	};
	function findMatchingSolModifier(arr)
	{
		var i, len, u, temp, subarr;
		if (arr.length === 2)
		{
			if (arr[0].index > arr[1].index)
			{
				temp = arr[0];
				arr[0] = arr[1];
				arr[1] = temp;
			}
		}
		else if (arr.length > 2)
			arr.sort(solArraySorter);		// so testSolsMatch compares in same order
		if (arr.length >= allUniqueSolModifiers.length)
			allUniqueSolModifiers.length = arr.length + 1;
		if (!allUniqueSolModifiers[arr.length])
			allUniqueSolModifiers[arr.length] = [];
		subarr = allUniqueSolModifiers[arr.length];
		for (i = 0, len = subarr.length; i < len; i++)
		{
			u = subarr[i];
			if (testSolsMatch(arr, u))
				return u;
		}
		subarr.push(arr);
		return arr;
	};
	function EventSheet(runtime, m)
	{
		this.runtime = runtime;
		this.triggers = {};
		this.fasttriggers = {};
        this.hasRun = false;
        this.includes = new cr.ObjectSet(); 	// all event sheets included by this sheet, at first-level indirection only
		this.deep_includes = [];				// all includes from this sheet recursively, in trigger order
		this.already_included_sheets = [];		// used while building deep_includes
		this.name = m[0];
		var em = m[1];		// events model
		this.events = [];       // triggers won't make it to this array
		var i, len;
		for (i = 0, len = em.length; i < len; i++)
			this.init_event(em[i], null, this.events);
	};
    EventSheet.prototype.toString = function ()
    {
        return this.name;
    };
	EventSheet.prototype.init_event = function (m, parent, nontriggers)
	{
		switch (m[0]) {
		case 0:	// event block
		{
			var block = new cr.eventblock(this, parent, m);
			cr.seal(block);
			if (block.orblock)
			{
				nontriggers.push(block);
				var i, len;
				for (i = 0, len = block.conditions.length; i < len; i++)
				{
					if (block.conditions[i].trigger)
						this.init_trigger(block, i);
				}
			}
			else
			{
				if (block.is_trigger())
					this.init_trigger(block, 0);
				else
					nontriggers.push(block);
			}
			break;
		}
		case 1: // variable
		{
			var v = new cr.eventvariable(this, parent, m);
			cr.seal(v);
			nontriggers.push(v);
			break;
		}
        case 2:	// include
        {
            var inc = new cr.eventinclude(this, parent, m);
			cr.seal(inc);
            nontriggers.push(inc);
			break;
        }
		default:
;
		}
	};
	EventSheet.prototype.postInit = function ()
	{
		var i, len;
		for (i = 0, len = this.events.length; i < len; i++)
		{
			this.events[i].postInit(i < len - 1 && this.events[i + 1].is_else_block);
		}
	};
	EventSheet.prototype.updateDeepIncludes = function ()
	{
		cr.clearArray(this.deep_includes);
		cr.clearArray(this.already_included_sheets);
		this.addDeepIncludes(this);
		cr.clearArray(this.already_included_sheets);
	};
	EventSheet.prototype.addDeepIncludes = function (root_sheet)
	{
		var i, len, inc, sheet;
		var deep_includes = root_sheet.deep_includes;
		var already_included_sheets = root_sheet.already_included_sheets;
		var arr = this.includes.valuesRef();
		for (i = 0, len = arr.length; i < len; ++i)
		{
			inc = arr[i];
			sheet = inc.include_sheet;
			if (!inc.isActive() || root_sheet === sheet || already_included_sheets.indexOf(sheet) > -1)
				continue;
			already_included_sheets.push(sheet);
			sheet.addDeepIncludes(root_sheet);
			deep_includes.push(sheet);
		}
	};
	EventSheet.prototype.run = function (from_include)
	{
		if (!this.runtime.resuming_breakpoint)
		{
			this.hasRun = true;
			if (!from_include)
				this.runtime.isRunningEvents = true;
		}
		var i, len;
		for (i = 0, len = this.events.length; i < len; i++)
		{
			var ev = this.events[i];
			ev.run();
				this.runtime.clearSol(ev.solModifiers);
				if (this.runtime.hasPendingInstances)
					this.runtime.ClearDeathRow();
		}
			if (!from_include)
				this.runtime.isRunningEvents = false;
	};
	function isPerformanceSensitiveTrigger(method)
	{
		if (cr.plugins_.Sprite && method === cr.plugins_.Sprite.prototype.cnds.OnFrameChanged)
		{
			return true;
		}
		return false;
	};
	EventSheet.prototype.init_trigger = function (trig, index)
	{
		if (!trig.orblock)
			this.runtime.triggers_to_postinit.push(trig);	// needs to be postInit'd later
		var i, len;
		var cnd = trig.conditions[index];
		var type_name;
		if (cnd.type)
			type_name = cnd.type.name;
		else
			type_name = "system";
		var fasttrigger = cnd.fasttrigger;
		var triggers = (fasttrigger ? this.fasttriggers : this.triggers);
		if (!triggers[type_name])
			triggers[type_name] = [];
		var obj_entry = triggers[type_name];
		var method = cnd.func;
		if (fasttrigger)
		{
			if (!cnd.parameters.length)				// no parameters
				return;
			var firstparam = cnd.parameters[0];
			if (firstparam.type !== 1 ||			// not a string param
				firstparam.expression.type !== 2)	// not a string literal node
			{
				return;
			}
			var fastevs;
			var firstvalue = firstparam.expression.value.toLowerCase();
			var i, len;
			for (i = 0, len = obj_entry.length; i < len; i++)
			{
				if (obj_entry[i].method == method)
				{
					fastevs = obj_entry[i].evs;
					if (!fastevs[firstvalue])
						fastevs[firstvalue] = [[trig, index]];
					else
						fastevs[firstvalue].push([trig, index]);
					return;
				}
			}
			fastevs = {};
			fastevs[firstvalue] = [[trig, index]];
			obj_entry.push({ method: method, evs: fastevs });
		}
		else
		{
			for (i = 0, len = obj_entry.length; i < len; i++)
			{
				if (obj_entry[i].method == method)
				{
					obj_entry[i].evs.push([trig, index]);
					return;
				}
			}
			if (isPerformanceSensitiveTrigger(method))
				obj_entry.unshift({ method: method, evs: [[trig, index]]});
			else
				obj_entry.push({ method: method, evs: [[trig, index]]});
		}
	};
	cr.eventsheet = EventSheet;
	function Selection(type)
	{
		this.type = type;
		this.instances = [];        // subset of picked instances
		this.else_instances = [];	// subset of unpicked instances
		this.select_all = true;
	};
	Selection.prototype.hasObjects = function ()
	{
		if (this.select_all)
			return this.type.instances.length;
		else
			return this.instances.length;
	};
	Selection.prototype.getObjects = function ()
	{
		if (this.select_all)
			return this.type.instances;
		else
			return this.instances;
	};
	/*
	Selection.prototype.ensure_picked = function (inst, skip_siblings)
	{
		var i, len;
		var orblock = inst.runtime.getCurrentEventStack().current_event.orblock;
		if (this.select_all)
		{
			this.select_all = false;
			if (orblock)
			{
				cr.shallowAssignArray(this.else_instances, inst.type.instances);
				cr.arrayFindRemove(this.else_instances, inst);
			}
			this.instances.length = 1;
			this.instances[0] = inst;
		}
		else
		{
			if (orblock)
			{
				i = this.else_instances.indexOf(inst);
				if (i !== -1)
				{
					this.instances.push(this.else_instances[i]);
					this.else_instances.splice(i, 1);
				}
			}
			else
			{
				if (this.instances.indexOf(inst) === -1)
					this.instances.push(inst);
			}
		}
		if (!skip_siblings)
		{
		}
	};
	*/
	Selection.prototype.pick_one = function (inst)
	{
		if (!inst)
			return;
		if (inst.runtime.getCurrentEventStack().current_event.orblock)
		{
			if (this.select_all)
			{
				cr.clearArray(this.instances);
				cr.shallowAssignArray(this.else_instances, inst.type.instances);
				this.select_all = false;
			}
			var i = this.else_instances.indexOf(inst);
			if (i !== -1)
			{
				this.instances.push(this.else_instances[i]);
				this.else_instances.splice(i, 1);
			}
		}
		else
		{
			this.select_all = false;
			cr.clearArray(this.instances);
			this.instances[0] = inst;
		}
	};
	cr.selection = Selection;
	function EventBlock(sheet, parent, m)
	{
		this.sheet = sheet;
		this.parent = parent;
		this.runtime = sheet.runtime;
		this.solModifiers = [];
		this.solModifiersIncludingParents = [];
		this.solWriterAfterCnds = false;	// block does not change SOL after running its conditions
		this.group = false;					// is group of events
		this.initially_activated = false;	// if a group, is active on startup
		this.toplevelevent = false;			// is an event block parented only by a top-level group
		this.toplevelgroup = false;			// is parented only by other groups or is top-level (i.e. not in a subevent)
		this.has_else_block = false;		// is followed by else
;
		this.conditions = [];
		this.actions = [];
		this.subevents = [];
		this.group_name = "";
		this.group = false;
		this.initially_activated = false;
		this.group_active = false;
		this.contained_includes = null;
        if (m[1])
        {
			this.group_name = m[1][1].toLowerCase();
			this.group = true;
			this.initially_activated = !!m[1][0];
			this.contained_includes = [];
			this.group_active = this.initially_activated;
			this.runtime.allGroups.push(this);
            this.runtime.groups_by_name[this.group_name] = this;
        }
		this.orblock = m[2];
		this.sid = m[4];
		if (!this.group)
			this.runtime.blocksBySid[this.sid.toString()] = this;
		var i, len;
		var cm = m[5];
		for (i = 0, len = cm.length; i < len; i++)
		{
			var cnd = new cr.condition(this, cm[i]);
			cnd.index = i;
			cr.seal(cnd);
			this.conditions.push(cnd);
			/*
			if (cnd.is_logical())
				this.is_logical = true;
			if (cnd.type && !cnd.type.plugin.singleglobal && this.cndReferences.indexOf(cnd.type) === -1)
				this.cndReferences.push(cnd.type);
			*/
			this.addSolModifier(cnd.type);
		}
		var am = m[6];
		for (i = 0, len = am.length; i < len; i++)
		{
			var act = new cr.action(this, am[i]);
			act.index = i;
			cr.seal(act);
			this.actions.push(act);
		}
		if (m.length === 8)
		{
			var em = m[7];
			for (i = 0, len = em.length; i < len; i++)
				this.sheet.init_event(em[i], this, this.subevents);
		}
		this.is_else_block = false;
		if (this.conditions.length)
		{
			this.is_else_block = (this.conditions[0].type == null && this.conditions[0].func == cr.system_object.prototype.cnds.Else);
		}
	};
	window["_c2hh_"] = "";
	EventBlock.prototype.postInit = function (hasElse/*, prevBlock_*/)
	{
		var i, len;
		var p = this.parent;
		if (this.group)
		{
			this.toplevelgroup = true;
			while (p)
			{
				if (!p.group)
				{
					this.toplevelgroup = false;
					break;
				}
				p = p.parent;
			}
		}
		this.toplevelevent = !this.is_trigger() && (!this.parent || (this.parent.group && this.parent.toplevelgroup));
		this.has_else_block = !!hasElse;
		this.solModifiersIncludingParents = this.solModifiers.slice(0);
		p = this.parent;
		while (p)
		{
			for (i = 0, len = p.solModifiers.length; i < len; i++)
				this.addParentSolModifier(p.solModifiers[i]);
			p = p.parent;
		}
		this.solModifiers = findMatchingSolModifier(this.solModifiers);
		this.solModifiersIncludingParents = findMatchingSolModifier(this.solModifiersIncludingParents);
		var i, len/*, s*/;
		for (i = 0, len = this.conditions.length; i < len; i++)
			this.conditions[i].postInit();
		for (i = 0, len = this.actions.length; i < len; i++)
			this.actions[i].postInit();
		for (i = 0, len = this.subevents.length; i < len; i++)
		{
			this.subevents[i].postInit(i < len - 1 && this.subevents[i + 1].is_else_block);
		}
		/*
		if (this.is_else_block && this.prev_block)
		{
			for (i = 0, len = this.prev_block.solModifiers.length; i < len; i++)
			{
				s = this.prev_block.solModifiers[i];
				if (this.solModifiers.indexOf(s) === -1)
					this.solModifiers.push(s);
			}
		}
		*/
	};
	EventBlock.prototype.setGroupActive = function (a)
	{
		if (this.group_active === !!a)
			return;		// same state
		this.group_active = !!a;
		var i, len;
		for (i = 0, len = this.contained_includes.length; i < len; ++i)
		{
			this.contained_includes[i].updateActive();
		}
		if (len > 0 && this.runtime.running_layout.event_sheet)
			this.runtime.running_layout.event_sheet.updateDeepIncludes();
	};
	function addSolModifierToList(type, arr)
	{
		var i, len, t;
		if (!type)
			return;
		if (arr.indexOf(type) === -1)
			arr.push(type);
		if (type.is_contained)
		{
			for (i = 0, len = type.container.length; i < len; i++)
			{
				t = type.container[i];
				if (type === t)
					continue;		// already handled
				if (arr.indexOf(t) === -1)
					arr.push(t);
			}
		}
	};
	EventBlock.prototype.addSolModifier = function (type)
	{
		addSolModifierToList(type, this.solModifiers);
	};
	EventBlock.prototype.addParentSolModifier = function (type)
	{
		addSolModifierToList(type, this.solModifiersIncludingParents);
	};
	EventBlock.prototype.setSolWriterAfterCnds = function ()
	{
		this.solWriterAfterCnds = true;
		if (this.parent)
			this.parent.setSolWriterAfterCnds();
	};
	EventBlock.prototype.is_trigger = function ()
	{
		if (!this.conditions.length)    // no conditions
			return false;
		else
			return this.conditions[0].trigger;
	};
	EventBlock.prototype.run = function ()
	{
		var i, len, c, any_true = false, cnd_result;
		var runtime = this.runtime;
		var evinfo = this.runtime.getCurrentEventStack();
		evinfo.current_event = this;
		var conditions = this.conditions;
			if (!this.is_else_block)
				evinfo.else_branch_ran = false;
		if (this.orblock)
		{
			if (conditions.length === 0)
				any_true = true;		// be sure to run if empty block
				evinfo.cndindex = 0
			for (len = conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
			{
				c = conditions[evinfo.cndindex];
				if (c.trigger)		// skip triggers when running OR block
					continue;
				cnd_result = c.run();
				if (cnd_result)			// make sure all conditions run and run if any were true
					any_true = true;
			}
			evinfo.last_event_true = any_true;
			if (any_true)
				this.run_actions_and_subevents();
		}
		else
		{
				evinfo.cndindex = 0
			for (len = conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
			{
				cnd_result = conditions[evinfo.cndindex].run();
				if (!cnd_result)    // condition failed
				{
					evinfo.last_event_true = false;
					if (this.toplevelevent && runtime.hasPendingInstances)
						runtime.ClearDeathRow();
					return;		// bail out now
				}
			}
			evinfo.last_event_true = true;
			this.run_actions_and_subevents();
		}
		this.end_run(evinfo);
	};
	EventBlock.prototype.end_run = function (evinfo)
	{
		if (evinfo.last_event_true && this.has_else_block)
			evinfo.else_branch_ran = true;
		if (this.toplevelevent && this.runtime.hasPendingInstances)
			this.runtime.ClearDeathRow();
	};
	EventBlock.prototype.run_orblocktrigger = function (index)
	{
		var evinfo = this.runtime.getCurrentEventStack();
		evinfo.current_event = this;
		if (this.conditions[index].run())
		{
			this.run_actions_and_subevents();
			this.runtime.getCurrentEventStack().last_event_true = true;
		}
	};
	EventBlock.prototype.run_actions_and_subevents = function ()
	{
		var evinfo = this.runtime.getCurrentEventStack();
		var len;
		for (evinfo.actindex = 0, len = this.actions.length; evinfo.actindex < len; evinfo.actindex++)
		{
			if (this.actions[evinfo.actindex].run())
				return;
		}
		this.run_subevents();
	};
	EventBlock.prototype.resume_actions_and_subevents = function ()
	{
		var evinfo = this.runtime.getCurrentEventStack();
		var len;
		for (len = this.actions.length; evinfo.actindex < len; evinfo.actindex++)
		{
			if (this.actions[evinfo.actindex].run())
				return;
		}
		this.run_subevents();
	};
	EventBlock.prototype.run_subevents = function ()
	{
		if (!this.subevents.length)
			return;
		var i, len, subev, pushpop/*, skipped_pop = false, pop_modifiers = null*/;
		var last = this.subevents.length - 1;
			this.runtime.pushEventStack(this);
		if (this.solWriterAfterCnds)
		{
			for (i = 0, len = this.subevents.length; i < len; i++)
			{
				subev = this.subevents[i];
					pushpop = (!this.toplevelgroup || (!this.group && i < last));
					if (pushpop)
						this.runtime.pushCopySol(subev.solModifiers);
				subev.run();
					if (pushpop)
						this.runtime.popSol(subev.solModifiers);
					else
						this.runtime.clearSol(subev.solModifiers);
			}
		}
		else
		{
			for (i = 0, len = this.subevents.length; i < len; i++)
			{
				this.subevents[i].run();
			}
		}
			this.runtime.popEventStack();
	};
	EventBlock.prototype.run_pretrigger = function ()
	{
		var evinfo = this.runtime.getCurrentEventStack();
		evinfo.current_event = this;
		var any_true = false;
		var i, len;
		for (evinfo.cndindex = 0, len = this.conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
		{
;
			if (this.conditions[evinfo.cndindex].run())
				any_true = true;
			else if (!this.orblock)			// condition failed (let OR blocks run all conditions anyway)
				return false;               // bail out
		}
		return this.orblock ? any_true : true;
	};
	EventBlock.prototype.retrigger = function ()
	{
		this.runtime.execcount++;
		var prevcndindex = this.runtime.getCurrentEventStack().cndindex;
		var len;
		var evinfo = this.runtime.pushEventStack(this);
		if (!this.orblock)
		{
			for (evinfo.cndindex = prevcndindex + 1, len = this.conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
			{
				if (!this.conditions[evinfo.cndindex].run())    // condition failed
				{
					this.runtime.popEventStack();               // moving up level of recursion
					return false;                               // bail out
				}
			}
		}
		this.run_actions_and_subevents();
		this.runtime.popEventStack();
		return true;		// ran an iteration
	};
	EventBlock.prototype.isFirstConditionOfType = function (cnd)
	{
		var cndindex = cnd.index;
		if (cndindex === 0)
			return true;
		--cndindex;
		for ( ; cndindex >= 0; --cndindex)
		{
			if (this.conditions[cndindex].type === cnd.type)
				return false;
		}
		return true;
	};
	cr.eventblock = EventBlock;
	function Condition(block, m)
	{
		this.block = block;
		this.sheet = block.sheet;
		this.runtime = block.runtime;
		this.parameters = [];
		this.results = [];
		this.extra = {};		// for plugins to stow away some custom info
		this.index = -1;
		this.anyParamVariesPerInstance = false;
		this.func = this.runtime.GetObjectReference(m[1]);
;
		this.trigger = (m[3] > 0);
		this.fasttrigger = (m[3] === 2);
		this.looping = m[4];
		this.inverted = m[5];
		this.isstatic = m[6];
		this.sid = m[7];
		this.runtime.cndsBySid[this.sid.toString()] = this;
		if (m[0] === -1)		// system object
		{
			this.type = null;
			this.run = this.run_system;
			this.behaviortype = null;
			this.beh_index = -1;
		}
		else
		{
			this.type = this.runtime.types_by_index[m[0]];
;
			if (this.isstatic)
				this.run = this.run_static;
			else
				this.run = this.run_object;
			if (m[2])
			{
				this.behaviortype = this.type.getBehaviorByName(m[2]);
;
				this.beh_index = this.type.getBehaviorIndexByName(m[2]);
;
			}
			else
			{
				this.behaviortype = null;
				this.beh_index = -1;
			}
			if (this.block.parent)
				this.block.parent.setSolWriterAfterCnds();
		}
		if (this.fasttrigger)
			this.run = this.run_true;
		if (m.length === 10)
		{
			var i, len;
			var em = m[9];
			for (i = 0, len = em.length; i < len; i++)
			{
				var param = new cr.parameter(this, em[i]);
				cr.seal(param);
				this.parameters.push(param);
			}
			this.results.length = em.length;
		}
	};
	Condition.prototype.postInit = function ()
	{
		var i, len, p;
		for (i = 0, len = this.parameters.length; i < len; i++)
		{
			p = this.parameters[i];
			p.postInit();
			if (p.variesPerInstance)
				this.anyParamVariesPerInstance = true;
		}
	};
	/*
	Condition.prototype.is_logical = function ()
	{
		return !this.type || this.type.plugin.singleglobal;
	};
	*/
	Condition.prototype.run_true = function ()
	{
		return true;
	};
	Condition.prototype.run_system = function ()
	{
		var i, len;
		for (i = 0, len = this.parameters.length; i < len; i++)
			this.results[i] = this.parameters[i].get();
		return cr.xor(this.func.apply(this.runtime.system, this.results), this.inverted);
	};
	Condition.prototype.run_static = function ()
	{
		var i, len;
		for (i = 0, len = this.parameters.length; i < len; i++)
			this.results[i] = this.parameters[i].get();
		var ret = this.func.apply(this.behaviortype ? this.behaviortype : this.type, this.results);
		this.type.applySolToContainer();
		return ret;
	};
	Condition.prototype.run_object = function ()
	{
		var i, j, k, leni, lenj, p, ret, met, inst, s, sol2;
		var type = this.type;
		var sol = type.getCurrentSol();
		var is_orblock = this.block.orblock && !this.trigger;		// triggers in OR blocks need to work normally
		var offset = 0;
		var is_contained = type.is_contained;
		var is_family = type.is_family;
		var family_index = type.family_index;
		var beh_index = this.beh_index;
		var is_beh = (beh_index > -1);
		var params_vary = this.anyParamVariesPerInstance;
		var parameters = this.parameters;
		var results = this.results;
		var inverted = this.inverted;
		var func = this.func;
		var arr, container;
		if (params_vary)
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
			{
				p = parameters[j];
				if (!p.variesPerInstance)
					results[j] = p.get(0);
			}
		}
		else
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
				results[j] = parameters[j].get(0);
		}
		if (sol.select_all) {
			cr.clearArray(sol.instances);       // clear contents
			cr.clearArray(sol.else_instances);
			arr = type.instances;
			for (i = 0, leni = arr.length; i < leni; ++i)
			{
				inst = arr[i];
;
				if (params_vary)
				{
					for (j = 0, lenj = parameters.length; j < lenj; ++j)
					{
						p = parameters[j];
						if (p.variesPerInstance)
							results[j] = p.get(i);        // default SOL index is current object
					}
				}
				if (is_beh)
				{
					offset = 0;
					if (is_family)
					{
						offset = inst.type.family_beh_map[family_index];
					}
					ret = func.apply(inst.behavior_insts[beh_index + offset], results);
				}
				else
					ret = func.apply(inst, results);
				met = cr.xor(ret, inverted);
				if (met)
					sol.instances.push(inst);
				else if (is_orblock)					// in OR blocks, keep the instances not meeting the condition for subsequent testing
					sol.else_instances.push(inst);
			}
			if (type.finish)
				type.finish(true);
			sol.select_all = false;
			type.applySolToContainer();
			return sol.hasObjects();
		}
		else {
			k = 0;
			var using_else_instances = (is_orblock && !this.block.isFirstConditionOfType(this));
			arr = (using_else_instances ? sol.else_instances : sol.instances);
			var any_true = false;
			for (i = 0, leni = arr.length; i < leni; ++i)
			{
				inst = arr[i];
;
				if (params_vary)
				{
					for (j = 0, lenj = parameters.length; j < lenj; ++j)
					{
						p = parameters[j];
						if (p.variesPerInstance)
							results[j] = p.get(i);        // default SOL index is current object
					}
				}
				if (is_beh)
				{
					offset = 0;
					if (is_family)
					{
						offset = inst.type.family_beh_map[family_index];
					}
					ret = func.apply(inst.behavior_insts[beh_index + offset], results);
				}
				else
					ret = func.apply(inst, results);
				if (cr.xor(ret, inverted))
				{
					any_true = true;
					if (using_else_instances)
					{
						sol.instances.push(inst);
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().instances.push(s);
							}
						}
					}
					else
					{
						arr[k] = inst;
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().instances[k] = s;
							}
						}
						k++;
					}
				}
				else
				{
					if (using_else_instances)
					{
						arr[k] = inst;
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().else_instances[k] = s;
							}
						}
						k++;
					}
					else if (is_orblock)
					{
						sol.else_instances.push(inst);
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().else_instances.push(s);
							}
						}
					}
				}
			}
			cr.truncateArray(arr, k);
			if (is_contained)
			{
				container = type.container;
				for (i = 0, leni = container.length; i < leni; i++)
				{
					sol2 = container[i].getCurrentSol();
					if (using_else_instances)
						cr.truncateArray(sol2.else_instances, k);
					else
						cr.truncateArray(sol2.instances, k);
				}
			}
			var pick_in_finish = any_true;		// don't pick in finish() if we're only doing the logic test below
			if (using_else_instances && !any_true)
			{
				for (i = 0, leni = sol.instances.length; i < leni; i++)
				{
					inst = sol.instances[i];
					if (params_vary)
					{
						for (j = 0, lenj = parameters.length; j < lenj; j++)
						{
							p = parameters[j];
							if (p.variesPerInstance)
								results[j] = p.get(i);
						}
					}
					if (is_beh)
						ret = func.apply(inst.behavior_insts[beh_index], results);
					else
						ret = func.apply(inst, results);
					if (cr.xor(ret, inverted))
					{
						any_true = true;
						break;		// got our flag, don't need to test any more
					}
				}
			}
			if (type.finish)
				type.finish(pick_in_finish || is_orblock);
			return is_orblock ? any_true : sol.hasObjects();
		}
	};
	cr.condition = Condition;
	function Action(block, m)
	{
		this.block = block;
		this.sheet = block.sheet;
		this.runtime = block.runtime;
		this.parameters = [];
		this.results = [];
		this.extra = {};		// for plugins to stow away some custom info
		this.index = -1;
		this.anyParamVariesPerInstance = false;
		this.func = this.runtime.GetObjectReference(m[1]);
;
		if (m[0] === -1)	// system
		{
			this.type = null;
			this.run = this.run_system;
			this.behaviortype = null;
			this.beh_index = -1;
		}
		else
		{
			this.type = this.runtime.types_by_index[m[0]];
;
			this.run = this.run_object;
			if (m[2])
			{
				this.behaviortype = this.type.getBehaviorByName(m[2]);
;
				this.beh_index = this.type.getBehaviorIndexByName(m[2]);
;
			}
			else
			{
				this.behaviortype = null;
				this.beh_index = -1;
			}
		}
		this.sid = m[3];
		this.runtime.actsBySid[this.sid.toString()] = this;
		if (m.length === 6)
		{
			var i, len;
			var em = m[5];
			for (i = 0, len = em.length; i < len; i++)
			{
				var param = new cr.parameter(this, em[i]);
				cr.seal(param);
				this.parameters.push(param);
			}
			this.results.length = em.length;
		}
	};
	Action.prototype.postInit = function ()
	{
		var i, len, p;
		for (i = 0, len = this.parameters.length; i < len; i++)
		{
			p = this.parameters[i];
			p.postInit();
			if (p.variesPerInstance)
				this.anyParamVariesPerInstance = true;
		}
	};
	Action.prototype.run_system = function ()
	{
		var runtime = this.runtime;
		var i, len;
		var parameters = this.parameters;
		var results = this.results;
		for (i = 0, len = parameters.length; i < len; ++i)
			results[i] = parameters[i].get();
		return this.func.apply(runtime.system, results);
	};
	Action.prototype.run_object = function ()
	{
		var type = this.type;
		var beh_index = this.beh_index;
		var family_index = type.family_index;
		var params_vary = this.anyParamVariesPerInstance;
		var parameters = this.parameters;
		var results = this.results;
		var func = this.func;
		var instances = type.getCurrentSol().getObjects();
		var is_family = type.is_family;
		var is_beh = (beh_index > -1);
		var i, j, leni, lenj, p, inst, offset;
		if (params_vary)
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
			{
				p = parameters[j];
				if (!p.variesPerInstance)
					results[j] = p.get(0);
			}
		}
		else
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
				results[j] = parameters[j].get(0);
		}
		for (i = 0, leni = instances.length; i < leni; ++i)
		{
			inst = instances[i];
			if (params_vary)
			{
				for (j = 0, lenj = parameters.length; j < lenj; ++j)
				{
					p = parameters[j];
					if (p.variesPerInstance)
						results[j] = p.get(i);    // pass i to use as default SOL index
				}
			}
			if (is_beh)
			{
				offset = 0;
				if (is_family)
				{
					offset = inst.type.family_beh_map[family_index];
				}
				func.apply(inst.behavior_insts[beh_index + offset], results);
			}
			else
				func.apply(inst, results);
		}
		return false;
	};
	cr.action = Action;
	var tempValues = [];
	var tempValuesPtr = -1;
	function pushTempValue()
	{
		tempValuesPtr++;
		if (tempValues.length === tempValuesPtr)
			tempValues.push(new cr.expvalue());
		return tempValues[tempValuesPtr];
	};
	function popTempValue()
	{
		tempValuesPtr--;
	};
	function Parameter(owner, m)
	{
		this.owner = owner;
		this.block = owner.block;
		this.sheet = owner.sheet;
		this.runtime = owner.runtime;
		this.type = m[0];
		this.expression = null;
		this.solindex = 0;
		this.get = null;
		this.combosel = 0;
		this.layout = null;
		this.key = 0;
		this.object = null;
		this.index = 0;
		this.varname = null;
		this.eventvar = null;
		this.fileinfo = null;
		this.subparams = null;
		this.variadicret = null;
		this.subparams = null;
		this.variadicret = null;
		this.variesPerInstance = false;
		var i, len, param;
		switch (m[0])
		{
			case 0:		// number
			case 7:		// any
				this.expression = new cr.expNode(this, m[1]);
				this.solindex = 0;
				this.get = this.get_exp;
				break;
			case 1:		// string
				this.expression = new cr.expNode(this, m[1]);
				this.solindex = 0;
				this.get = this.get_exp_str;
				break;
			case 5:		// layer
				this.expression = new cr.expNode(this, m[1]);
				this.solindex = 0;
				this.get = this.get_layer;
				break;
			case 3:		// combo
			case 8:		// cmp
				this.combosel = m[1];
				this.get = this.get_combosel;
				break;
			case 6:		// layout
				this.layout = this.runtime.layouts[m[1]];
;
				this.get = this.get_layout;
				break;
			case 9:		// keyb
				this.key = m[1];
				this.get = this.get_key;
				break;
			case 4:		// object
				this.object = this.runtime.types_by_index[m[1]];
;
				this.get = this.get_object;
				this.block.addSolModifier(this.object);
				if (this.owner instanceof cr.action)
					this.block.setSolWriterAfterCnds();
				else if (this.block.parent)
					this.block.parent.setSolWriterAfterCnds();
				break;
			case 10:	// instvar
				this.index = m[1];
				if (owner.type && owner.type.is_family)
				{
					this.get = this.get_familyvar;
					this.variesPerInstance = true;
				}
				else
					this.get = this.get_instvar;
				break;
			case 11:	// eventvar
				this.varname = m[1];
				this.eventvar = null;
				this.get = this.get_eventvar;
				break;
			case 2:		// audiofile	["name", ismusic]
			case 12:	// fileinfo		"name"
				this.fileinfo = m[1];
				this.get = this.get_audiofile;
				break;
			case 13:	// variadic
				this.get = this.get_variadic;
				this.subparams = [];
				this.variadicret = [];
				for (i = 1, len = m.length; i < len; i++)
				{
					param = new cr.parameter(this.owner, m[i]);
					cr.seal(param);
					this.subparams.push(param);
					this.variadicret.push(0);
				}
				break;
			default:
;
		}
	};
	Parameter.prototype.postInit = function ()
	{
		var i, len;
		if (this.type === 11)		// eventvar
		{
			this.eventvar = this.runtime.getEventVariableByName(this.varname, this.block.parent);
;
		}
		else if (this.type === 13)	// variadic, postInit all sub-params
		{
			for (i = 0, len = this.subparams.length; i < len; i++)
				this.subparams[i].postInit();
		}
		if (this.expression)
			this.expression.postInit();
	};
	Parameter.prototype.maybeVaryForType = function (t)
	{
		if (this.variesPerInstance)
			return;				// already varies per instance, no need to check again
		if (!t)
			return;				// never vary for system type
		if (!t.plugin.singleglobal)
		{
			this.variesPerInstance = true;
			return;
		}
	};
	Parameter.prototype.setVaries = function ()
	{
		this.variesPerInstance = true;
	};
	Parameter.prototype.get_exp = function (solindex)
	{
		this.solindex = solindex || 0;   // default SOL index to use
		var temp = pushTempValue();
		this.expression.get(temp);
		popTempValue();
		return temp.data;      			// return actual JS value, not expvalue
	};
	Parameter.prototype.get_exp_str = function (solindex)
	{
		this.solindex = solindex || 0;   // default SOL index to use
		var temp = pushTempValue();
		this.expression.get(temp);
		popTempValue();
		if (cr.is_string(temp.data))
			return temp.data;
		else
			return "";
	};
	Parameter.prototype.get_object = function ()
	{
		return this.object;
	};
	Parameter.prototype.get_combosel = function ()
	{
		return this.combosel;
	};
	Parameter.prototype.get_layer = function (solindex)
	{
		this.solindex = solindex || 0;   // default SOL index to use
		var temp = pushTempValue();
		this.expression.get(temp);
		popTempValue();
		if (temp.is_number())
			return this.runtime.getLayerByNumber(temp.data);
		else
			return this.runtime.getLayerByName(temp.data);
	}
	Parameter.prototype.get_layout = function ()
	{
		return this.layout;
	};
	Parameter.prototype.get_key = function ()
	{
		return this.key;
	};
	Parameter.prototype.get_instvar = function ()
	{
		return this.index;
	};
	Parameter.prototype.get_familyvar = function (solindex_)
	{
		var solindex = solindex_ || 0;
		var familytype = this.owner.type;
		var realtype = null;
		var sol = familytype.getCurrentSol();
		var objs = sol.getObjects();
		if (objs.length)
			realtype = objs[solindex % objs.length].type;
		else if (sol.else_instances.length)
			realtype = sol.else_instances[solindex % sol.else_instances.length].type;
		else if (familytype.instances.length)
			realtype = familytype.instances[solindex % familytype.instances.length].type;
		else
			return 0;
		return this.index + realtype.family_var_map[familytype.family_index];
	};
	Parameter.prototype.get_eventvar = function ()
	{
		return this.eventvar;
	};
	Parameter.prototype.get_audiofile = function ()
	{
		return this.fileinfo;
	};
	Parameter.prototype.get_variadic = function ()
	{
		var i, len;
		for (i = 0, len = this.subparams.length; i < len; i++)
		{
			this.variadicret[i] = this.subparams[i].get();
		}
		return this.variadicret;
	};
	cr.parameter = Parameter;
	function EventVariable(sheet, parent, m)
	{
		this.sheet = sheet;
		this.parent = parent;
		this.runtime = sheet.runtime;
		this.solModifiers = [];
		this.name = m[1];
		this.vartype = m[2];
		this.initial = m[3];
		this.is_static = !!m[4];
		this.is_constant = !!m[5];
		this.sid = m[6];
		this.runtime.varsBySid[this.sid.toString()] = this;
		this.data = this.initial;	// note: also stored in event stack frame for local nonstatic nonconst vars
		if (this.parent)			// local var
		{
			if (this.is_static || this.is_constant)
				this.localIndex = -1;
			else
				this.localIndex = this.runtime.stackLocalCount++;
			this.runtime.all_local_vars.push(this);
		}
		else						// global var
		{
			this.localIndex = -1;
			this.runtime.all_global_vars.push(this);
		}
	};
	EventVariable.prototype.postInit = function ()
	{
		this.solModifiers = findMatchingSolModifier(this.solModifiers);
	};
	EventVariable.prototype.setValue = function (x)
	{
;
		var lvs = this.runtime.getCurrentLocalVarStack();
		if (!this.parent || this.is_static || !lvs)
			this.data = x;
		else	// local nonstatic variable: use event stack to keep value at this level of recursion
		{
			if (this.localIndex >= lvs.length)
				lvs.length = this.localIndex + 1;
			lvs[this.localIndex] = x;
		}
	};
	EventVariable.prototype.getValue = function ()
	{
		var lvs = this.runtime.getCurrentLocalVarStack();
		if (!this.parent || this.is_static || !lvs || this.is_constant)
			return this.data;
		else	// local nonstatic variable
		{
			if (this.localIndex >= lvs.length)
			{
				return this.initial;
			}
			if (typeof lvs[this.localIndex] === "undefined")
			{
				return this.initial;
			}
			return lvs[this.localIndex];
		}
	};
	EventVariable.prototype.run = function ()
	{
			if (this.parent && !this.is_static && !this.is_constant)
				this.setValue(this.initial);
	};
	cr.eventvariable = EventVariable;
	function EventInclude(sheet, parent, m)
	{
		this.sheet = sheet;
		this.parent = parent;
		this.runtime = sheet.runtime;
		this.solModifiers = [];
		this.include_sheet = null;		// determined in postInit
		this.include_sheet_name = m[1];
		this.active = true;
	};
	EventInclude.prototype.toString = function ()
	{
		return "include:" + this.include_sheet.toString();
	};
	EventInclude.prototype.postInit = function ()
	{
        this.include_sheet = this.runtime.eventsheets[this.include_sheet_name];
;
;
        this.sheet.includes.add(this);
		this.solModifiers = findMatchingSolModifier(this.solModifiers);
		var p = this.parent;
		while (p)
		{
			if (p.group)
				p.contained_includes.push(this);
			p = p.parent;
		}
		this.updateActive();
	};
	EventInclude.prototype.run = function ()
	{
			if (this.parent)
				this.runtime.pushCleanSol(this.runtime.types_by_index);
        if (!this.include_sheet.hasRun)
            this.include_sheet.run(true);			// from include
			if (this.parent)
				this.runtime.popSol(this.runtime.types_by_index);
	};
	EventInclude.prototype.updateActive = function ()
	{
		var p = this.parent;
		while (p)
		{
			if (p.group && !p.group_active)
			{
				this.active = false;
				return;
			}
			p = p.parent;
		}
		this.active = true;
	};
	EventInclude.prototype.isActive = function ()
	{
		return this.active;
	};
	cr.eventinclude = EventInclude;
	function EventStackFrame()
	{
		this.temp_parents_arr = [];
		this.reset(null);
		cr.seal(this);
	};
	EventStackFrame.prototype.reset = function (cur_event)
	{
		this.current_event = cur_event;
		this.cndindex = 0;
		this.actindex = 0;
		cr.clearArray(this.temp_parents_arr);
		this.last_event_true = false;
		this.else_branch_ran = false;
		this.any_true_state = false;
	};
	EventStackFrame.prototype.isModifierAfterCnds = function ()
	{
		if (this.current_event.solWriterAfterCnds)
			return true;
		if (this.cndindex < this.current_event.conditions.length - 1)
			return !!this.current_event.solModifiers.length;
		return false;
	};
	cr.eventStackFrame = EventStackFrame;
}());
(function()
{
	function ExpNode(owner_, m)
	{
		this.owner = owner_;
		this.runtime = owner_.runtime;
		this.type = m[0];
;
		this.get = [this.eval_int,
					this.eval_float,
					this.eval_string,
					this.eval_unaryminus,
					this.eval_add,
					this.eval_subtract,
					this.eval_multiply,
					this.eval_divide,
					this.eval_mod,
					this.eval_power,
					this.eval_and,
					this.eval_or,
					this.eval_equal,
					this.eval_notequal,
					this.eval_less,
					this.eval_lessequal,
					this.eval_greater,
					this.eval_greaterequal,
					this.eval_conditional,
					this.eval_system_exp,
					this.eval_object_exp,
					this.eval_instvar_exp,
					this.eval_behavior_exp,
					this.eval_eventvar_exp][this.type];
		var paramsModel = null;
		this.value = null;
		this.first = null;
		this.second = null;
		this.third = null;
		this.func = null;
		this.results = null;
		this.parameters = null;
		this.object_type = null;
		this.beh_index = -1;
		this.instance_expr = null;
		this.varindex = -1;
		this.behavior_type = null;
		this.varname = null;
		this.eventvar = null;
		this.return_string = false;
		switch (this.type) {
		case 0:		// int
		case 1:		// float
		case 2:		// string
			this.value = m[1];
			break;
		case 3:		// unaryminus
			this.first = new cr.expNode(owner_, m[1]);
			break;
		case 18:	// conditional
			this.first = new cr.expNode(owner_, m[1]);
			this.second = new cr.expNode(owner_, m[2]);
			this.third = new cr.expNode(owner_, m[3]);
			break;
		case 19:	// system_exp
			this.func = this.runtime.GetObjectReference(m[1]);
;
			if (this.func === cr.system_object.prototype.exps.random
			 || this.func === cr.system_object.prototype.exps.choose)
			{
				this.owner.setVaries();
			}
			this.results = [];
			this.parameters = [];
			if (m.length === 3)
			{
				paramsModel = m[2];
				this.results.length = paramsModel.length + 1;	// must also fit 'ret'
			}
			else
				this.results.length = 1;      // to fit 'ret'
			break;
		case 20:	// object_exp
			this.object_type = this.runtime.types_by_index[m[1]];
;
			this.beh_index = -1;
			this.func = this.runtime.GetObjectReference(m[2]);
			this.return_string = m[3];
			if (cr.plugins_.Function && this.func === cr.plugins_.Function.prototype.exps.Call)
			{
				this.owner.setVaries();
			}
			if (m[4])
				this.instance_expr = new cr.expNode(owner_, m[4]);
			else
				this.instance_expr = null;
			this.results = [];
			this.parameters = [];
			if (m.length === 6)
			{
				paramsModel = m[5];
				this.results.length = paramsModel.length + 1;
			}
			else
				this.results.length = 1;	// to fit 'ret'
			break;
		case 21:		// instvar_exp
			this.object_type = this.runtime.types_by_index[m[1]];
;
			this.return_string = m[2];
			if (m[3])
				this.instance_expr = new cr.expNode(owner_, m[3]);
			else
				this.instance_expr = null;
			this.varindex = m[4];
			break;
		case 22:		// behavior_exp
			this.object_type = this.runtime.types_by_index[m[1]];
;
			this.behavior_type = this.object_type.getBehaviorByName(m[2]);
;
			this.beh_index = this.object_type.getBehaviorIndexByName(m[2]);
			this.func = this.runtime.GetObjectReference(m[3]);
			this.return_string = m[4];
			if (m[5])
				this.instance_expr = new cr.expNode(owner_, m[5]);
			else
				this.instance_expr = null;
			this.results = [];
			this.parameters = [];
			if (m.length === 7)
			{
				paramsModel = m[6];
				this.results.length = paramsModel.length + 1;
			}
			else
				this.results.length = 1;	// to fit 'ret'
			break;
		case 23:		// eventvar_exp
			this.varname = m[1];
			this.eventvar = null;	// assigned in postInit
			break;
		}
		this.owner.maybeVaryForType(this.object_type);
		if (this.type >= 4 && this.type <= 17)
		{
			this.first = new cr.expNode(owner_, m[1]);
			this.second = new cr.expNode(owner_, m[2]);
		}
		if (paramsModel)
		{
			var i, len;
			for (i = 0, len = paramsModel.length; i < len; i++)
				this.parameters.push(new cr.expNode(owner_, paramsModel[i]));
		}
		cr.seal(this);
	};
	ExpNode.prototype.postInit = function ()
	{
		if (this.type === 23)	// eventvar_exp
		{
			this.eventvar = this.owner.runtime.getEventVariableByName(this.varname, this.owner.block.parent);
;
		}
		if (this.first)
			this.first.postInit();
		if (this.second)
			this.second.postInit();
		if (this.third)
			this.third.postInit();
		if (this.instance_expr)
			this.instance_expr.postInit();
		if (this.parameters)
		{
			var i, len;
			for (i = 0, len = this.parameters.length; i < len; i++)
				this.parameters[i].postInit();
		}
	};
	var tempValues = [];
	var tempValuesPtr = -1;
	function pushTempValue()
	{
		++tempValuesPtr;
		if (tempValues.length === tempValuesPtr)
			tempValues.push(new cr.expvalue());
		return tempValues[tempValuesPtr];
	};
	function popTempValue()
	{
		--tempValuesPtr;
	};
	function eval_params(parameters, results, temp)
	{
		var i, len;
		for (i = 0, len = parameters.length; i < len; ++i)
		{
			parameters[i].get(temp);
			results[i + 1] = temp.data;   // passing actual javascript value as argument instead of expvalue
		}
	}
	ExpNode.prototype.eval_system_exp = function (ret)
	{
		var parameters = this.parameters;
		var results = this.results;
		results[0] = ret;
		var temp = pushTempValue();
		eval_params(parameters, results, temp);
		popTempValue();
		this.func.apply(this.runtime.system, results);
	};
	ExpNode.prototype.eval_object_exp = function (ret)
	{
		var object_type = this.object_type;
		var results = this.results;
		var parameters = this.parameters;
		var instance_expr = this.instance_expr;
		var func = this.func;
		var index = this.owner.solindex;			// default to parameter's intended SOL index
		var sol = object_type.getCurrentSol();
		var instances = sol.getObjects();
		if (!instances.length)
		{
			if (sol.else_instances.length)
				instances = sol.else_instances;
			else
			{
				if (this.return_string)
					ret.set_string("");
				else
					ret.set_int(0);
				return;
			}
		}
		results[0] = ret;
		ret.object_class = object_type;		// so expression can access family type if need be
		var temp = pushTempValue();
		eval_params(parameters, results, temp);
		if (instance_expr) {
			instance_expr.get(temp);
			if (temp.is_number()) {
				index = temp.data;
				instances = object_type.instances;    // pick from all instances, not SOL
			}
		}
		popTempValue();
		var len = instances.length;
		if (index >= len || index <= -len)
			index %= len;      // wraparound
		if (index < 0)
			index += len;
		var returned_val = func.apply(instances[index], results);
;
	};
	ExpNode.prototype.eval_behavior_exp = function (ret)
	{
		var object_type = this.object_type;
		var results = this.results;
		var parameters = this.parameters;
		var instance_expr = this.instance_expr;
		var beh_index = this.beh_index;
		var func = this.func;
		var index = this.owner.solindex;			// default to parameter's intended SOL index
		var sol = object_type.getCurrentSol();
		var instances = sol.getObjects();
		if (!instances.length)
		{
			if (sol.else_instances.length)
				instances = sol.else_instances;
			else
			{
				if (this.return_string)
					ret.set_string("");
				else
					ret.set_int(0);
				return;
			}
		}
		results[0] = ret;
		ret.object_class = object_type;		// so expression can access family type if need be
		var temp = pushTempValue();
		eval_params(parameters, results, temp);
		if (instance_expr) {
			instance_expr.get(temp);
			if (temp.is_number()) {
				index = temp.data;
				instances = object_type.instances;    // pick from all instances, not SOL
			}
		}
		popTempValue();
		var len = instances.length;
		if (index >= len || index <= -len)
			index %= len;      // wraparound
		if (index < 0)
			index += len;
		var inst = instances[index];
		var offset = 0;
		if (object_type.is_family)
		{
			offset = inst.type.family_beh_map[object_type.family_index];
		}
		var returned_val = func.apply(inst.behavior_insts[beh_index + offset], results);
;
	};
	ExpNode.prototype.eval_instvar_exp = function (ret)
	{
		var instance_expr = this.instance_expr;
		var object_type = this.object_type;
		var varindex = this.varindex;
		var index = this.owner.solindex;		// default to parameter's intended SOL index
		var sol = object_type.getCurrentSol();
		var instances = sol.getObjects();
		var inst;
		if (!instances.length)
		{
			if (sol.else_instances.length)
				instances = sol.else_instances;
			else
			{
				if (this.return_string)
					ret.set_string("");
				else
					ret.set_int(0);
				return;
			}
		}
		if (instance_expr)
		{
			var temp = pushTempValue();
			instance_expr.get(temp);
			if (temp.is_number())
			{
				index = temp.data;
				var type_instances = object_type.instances;
				if (type_instances.length !== 0)		// avoid NaN result with %
				{
					index %= type_instances.length;     // wraparound
					if (index < 0)                      // offset
						index += type_instances.length;
				}
				inst = object_type.getInstanceByIID(index);
				var to_ret = inst.instance_vars[varindex];
				if (cr.is_string(to_ret))
					ret.set_string(to_ret);
				else
					ret.set_float(to_ret);
				popTempValue();
				return;         // done
			}
			popTempValue();
		}
		var len = instances.length;
		if (index >= len || index <= -len)
			index %= len;		// wraparound
		if (index < 0)
			index += len;
		inst = instances[index];
		var offset = 0;
		if (object_type.is_family)
		{
			offset = inst.type.family_var_map[object_type.family_index];
		}
		var to_ret = inst.instance_vars[varindex + offset];
		if (cr.is_string(to_ret))
			ret.set_string(to_ret);
		else
			ret.set_float(to_ret);
	};
	ExpNode.prototype.eval_int = function (ret)
	{
		ret.type = cr.exptype.Integer;
		ret.data = this.value;
	};
	ExpNode.prototype.eval_float = function (ret)
	{
		ret.type = cr.exptype.Float;
		ret.data = this.value;
	};
	ExpNode.prototype.eval_string = function (ret)
	{
		ret.type = cr.exptype.String;
		ret.data = this.value;
	};
	ExpNode.prototype.eval_unaryminus = function (ret)
	{
		this.first.get(ret);                // retrieve operand
		if (ret.is_number())
			ret.data = -ret.data;
	};
	ExpNode.prototype.eval_add = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data += temp.data;          // both operands numbers: add
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_subtract = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data -= temp.data;          // both operands numbers: subtract
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_multiply = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data *= temp.data;          // both operands numbers: multiply
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_divide = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data /= temp.data;          // both operands numbers: divide
			ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_mod = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data %= temp.data;          // both operands numbers: modulo
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_power = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data = Math.pow(ret.data, temp.data);   // both operands numbers: raise to power
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_and = function (ret)
	{
		this.first.get(ret);			// left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (temp.is_string() || ret.is_string())
			this.eval_and_stringconcat(ret, temp);
		else
			this.eval_and_logical(ret, temp);
		popTempValue();
	};
	ExpNode.prototype.eval_and_stringconcat = function (ret, temp)
	{
		if (ret.is_string() && temp.is_string())
			this.eval_and_stringconcat_str_str(ret, temp);
		else
			this.eval_and_stringconcat_num(ret, temp);
	};
	ExpNode.prototype.eval_and_stringconcat_str_str = function (ret, temp)
	{
		ret.data += temp.data;
	};
	ExpNode.prototype.eval_and_stringconcat_num = function (ret, temp)
	{
		if (ret.is_string())
		{
			ret.data += (Math.round(temp.data * 1e10) / 1e10).toString();
		}
		else
		{
			ret.set_string(ret.data.toString() + temp.data);
		}
	};
	ExpNode.prototype.eval_and_logical = function (ret, temp)
	{
		ret.set_int(ret.data && temp.data ? 1 : 0);
	};
	ExpNode.prototype.eval_or = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			if (ret.data || temp.data)
				ret.set_int(1);
			else
				ret.set_int(0);
		}
		popTempValue();
	};
	ExpNode.prototype.eval_conditional = function (ret)
	{
		this.first.get(ret);                // condition operand
		if (ret.data)                       // is true
			this.second.get(ret);           // evaluate second operand to ret
		else
			this.third.get(ret);            // evaluate third operand to ret
	};
	ExpNode.prototype.eval_equal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data === temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_notequal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data !== temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_less = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data < temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_lessequal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data <= temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_greater = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data > temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_greaterequal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data >= temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_eventvar_exp = function (ret)
	{
		var val = this.eventvar.getValue();
		if (cr.is_number(val))
			ret.set_float(val);
		else
			ret.set_string(val);
	};
	cr.expNode = ExpNode;
	function ExpValue(type, data)
	{
		this.type = type || cr.exptype.Integer;
		this.data = data || 0;
		this.object_class = null;
;
;
;
		if (this.type == cr.exptype.Integer)
			this.data = Math.floor(this.data);
		cr.seal(this);
	};
	ExpValue.prototype.is_int = function ()
	{
		return this.type === cr.exptype.Integer;
	};
	ExpValue.prototype.is_float = function ()
	{
		return this.type === cr.exptype.Float;
	};
	ExpValue.prototype.is_number = function ()
	{
		return this.type === cr.exptype.Integer || this.type === cr.exptype.Float;
	};
	ExpValue.prototype.is_string = function ()
	{
		return this.type === cr.exptype.String;
	};
	ExpValue.prototype.make_int = function ()
	{
		if (!this.is_int())
		{
			if (this.is_float())
				this.data = Math.floor(this.data);      // truncate float
			else if (this.is_string())
				this.data = parseInt(this.data, 10);
			this.type = cr.exptype.Integer;
		}
	};
	ExpValue.prototype.make_float = function ()
	{
		if (!this.is_float())
		{
			if (this.is_string())
				this.data = parseFloat(this.data);
			this.type = cr.exptype.Float;
		}
	};
	ExpValue.prototype.make_string = function ()
	{
		if (!this.is_string())
		{
			this.data = this.data.toString();
			this.type = cr.exptype.String;
		}
	};
	ExpValue.prototype.set_int = function (val)
	{
;
		this.type = cr.exptype.Integer;
		this.data = Math.floor(val);
	};
	ExpValue.prototype.set_float = function (val)
	{
;
		this.type = cr.exptype.Float;
		this.data = val;
	};
	ExpValue.prototype.set_string = function (val)
	{
;
		this.type = cr.exptype.String;
		this.data = val;
	};
	ExpValue.prototype.set_any = function (val)
	{
		if (cr.is_number(val))
		{
			this.type = cr.exptype.Float;
			this.data = val;
		}
		else if (cr.is_string(val))
		{
			this.type = cr.exptype.String;
			this.data = val.toString();
		}
		else
		{
			this.type = cr.exptype.Integer;
			this.data = 0;
		}
	};
	cr.expvalue = ExpValue;
	cr.exptype = {
		Integer: 0,     // emulated; no native integer support in javascript
		Float: 1,
		String: 2
	};
}());
;
cr.system_object = function (runtime)
{
    this.runtime = runtime;
	this.waits = [];
};
cr.system_object.prototype.saveToJSON = function ()
{
	var o = {};
	var i, len, j, lenj, p, w, t, sobj;
	o["waits"] = [];
	var owaits = o["waits"];
	var waitobj;
	for (i = 0, len = this.waits.length; i < len; i++)
	{
		w = this.waits[i];
		waitobj = {
			"t": w.time,
			"st": w.signaltag,
			"s": w.signalled,
			"ev": w.ev.sid,
			"sm": [],
			"sols": {}
		};
		if (w.ev.actions[w.actindex])
			waitobj["act"] = w.ev.actions[w.actindex].sid;
		for (j = 0, lenj = w.solModifiers.length; j < lenj; j++)
			waitobj["sm"].push(w.solModifiers[j].sid);
		for (p in w.sols)
		{
			if (w.sols.hasOwnProperty(p))
			{
				t = this.runtime.types_by_index[parseInt(p, 10)];
;
				sobj = {
					"sa": w.sols[p].sa,
					"insts": []
				};
				for (j = 0, lenj = w.sols[p].insts.length; j < lenj; j++)
					sobj["insts"].push(w.sols[p].insts[j].uid);
				waitobj["sols"][t.sid.toString()] = sobj;
			}
		}
		owaits.push(waitobj);
	}
	return o;
};
cr.system_object.prototype.loadFromJSON = function (o)
{
	var owaits = o["waits"];
	var i, len, j, lenj, p, w, addWait, e, aindex, t, savedsol, nusol, inst;
	cr.clearArray(this.waits);
	for (i = 0, len = owaits.length; i < len; i++)
	{
		w = owaits[i];
		e = this.runtime.blocksBySid[w["ev"].toString()];
		if (!e)
			continue;	// event must've gone missing
		aindex = -1;
		for (j = 0, lenj = e.actions.length; j < lenj; j++)
		{
			if (e.actions[j].sid === w["act"])
			{
				aindex = j;
				break;
			}
		}
		if (aindex === -1)
			continue;	// action must've gone missing
		addWait = {};
		addWait.sols = {};
		addWait.solModifiers = [];
		addWait.deleteme = false;
		addWait.time = w["t"];
		addWait.signaltag = w["st"] || "";
		addWait.signalled = !!w["s"];
		addWait.ev = e;
		addWait.actindex = aindex;
		for (j = 0, lenj = w["sm"].length; j < lenj; j++)
		{
			t = this.runtime.getObjectTypeBySid(w["sm"][j]);
			if (t)
				addWait.solModifiers.push(t);
		}
		for (p in w["sols"])
		{
			if (w["sols"].hasOwnProperty(p))
			{
				t = this.runtime.getObjectTypeBySid(parseInt(p, 10));
				if (!t)
					continue;		// type must've been deleted
				savedsol = w["sols"][p];
				nusol = {
					sa: savedsol["sa"],
					insts: []
				};
				for (j = 0, lenj = savedsol["insts"].length; j < lenj; j++)
				{
					inst = this.runtime.getObjectByUID(savedsol["insts"][j]);
					if (inst)
						nusol.insts.push(inst);
				}
				addWait.sols[t.index.toString()] = nusol;
			}
		}
		this.waits.push(addWait);
	}
};
(function ()
{
	var sysProto = cr.system_object.prototype;
	function SysCnds() {};
    SysCnds.prototype.EveryTick = function()
    {
        return true;
    };
    SysCnds.prototype.OnLayoutStart = function()
    {
        return true;
    };
    SysCnds.prototype.OnLayoutEnd = function()
    {
        return true;
    };
    SysCnds.prototype.Compare = function(x, cmp, y)
    {
        return cr.do_cmp(x, cmp, y);
    };
    SysCnds.prototype.CompareTime = function (cmp, t)
    {
        var elapsed = this.runtime.kahanTime.sum;
        if (cmp === 0)
        {
            var cnd = this.runtime.getCurrentCondition();
            if (!cnd.extra["CompareTime_executed"])
            {
                if (elapsed >= t)
                {
                    cnd.extra["CompareTime_executed"] = true;
                    return true;
                }
            }
            return false;
        }
        return cr.do_cmp(elapsed, cmp, t);
    };
    SysCnds.prototype.LayerVisible = function (layer)
    {
        if (!layer)
            return false;
        else
            return layer.visible;
    };
	SysCnds.prototype.LayerEmpty = function (layer)
    {
        if (!layer)
            return false;
        else
            return !layer.instances.length;
    };
	SysCnds.prototype.LayerCmpOpacity = function (layer, cmp, opacity_)
	{
		if (!layer)
			return false;
		return cr.do_cmp(layer.opacity * 100, cmp, opacity_);
	};
    SysCnds.prototype.Repeat = function (count)
    {
		var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
        var i;
		if (solModifierAfterCnds)
		{
			for (i = 0; i < count && !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				current_loop.index = i;
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			for (i = 0; i < count && !current_loop.stopped; i++)
			{
				current_loop.index = i;
				current_event.retrigger();
			}
		}
        this.runtime.popLoopStack();
		return false;
    };
	SysCnds.prototype.While = function (count)
    {
		var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
        var i;
		if (solModifierAfterCnds)
		{
			for (i = 0; !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				current_loop.index = i;
				if (!current_event.retrigger())		// one of the other conditions returned false
					current_loop.stopped = true;	// break
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			for (i = 0; !current_loop.stopped; i++)
			{
				current_loop.index = i;
				if (!current_event.retrigger())
					current_loop.stopped = true;
			}
		}
        this.runtime.popLoopStack();
		return false;
    };
    SysCnds.prototype.For = function (name, start, end)
    {
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack(name);
        var i;
		if (end < start)
		{
			if (solModifierAfterCnds)
			{
				for (i = start; i >= end && !current_loop.stopped; --i)  // inclusive to end
				{
					this.runtime.pushCopySol(current_event.solModifiers);
					current_loop.index = i;
					current_event.retrigger();
					this.runtime.popSol(current_event.solModifiers);
				}
			}
			else
			{
				for (i = start; i >= end && !current_loop.stopped; --i)  // inclusive to end
				{
					current_loop.index = i;
					current_event.retrigger();
				}
			}
		}
		else
		{
			if (solModifierAfterCnds)
			{
				for (i = start; i <= end && !current_loop.stopped; ++i)  // inclusive to end
				{
					this.runtime.pushCopySol(current_event.solModifiers);
					current_loop.index = i;
					current_event.retrigger();
					this.runtime.popSol(current_event.solModifiers);
				}
			}
			else
			{
				for (i = start; i <= end && !current_loop.stopped; ++i)  // inclusive to end
				{
					current_loop.index = i;
					current_event.retrigger();
				}
			}
		}
        this.runtime.popLoopStack();
		return false;
    };
	var foreach_instancestack = [];
	var foreach_instanceptr = -1;
    SysCnds.prototype.ForEach = function (obj)
    {
        var sol = obj.getCurrentSol();
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var instances = foreach_instancestack[foreach_instanceptr];
		cr.shallowAssignArray(instances, sol.getObjects());
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
        var i, len, j, lenj, inst, s, sol2;
		var is_contained = obj.is_contained;
		if (solModifierAfterCnds)
		{
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				inst = instances[i];
				sol = obj.getCurrentSol();
				sol.select_all = false;
				cr.clearArray(sol.instances);
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			sol.select_all = false;
			cr.clearArray(sol.instances);
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				inst = instances[i];
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
			}
		}
		cr.clearArray(instances);
        this.runtime.popLoopStack();
		foreach_instanceptr--;
		return false;
    };
	function foreach_sortinstances(a, b)
	{
		var va = a.extra["c2_feo_val"];
		var vb = b.extra["c2_feo_val"];
		if (cr.is_number(va) && cr.is_number(vb))
			return va - vb;
		else
		{
			va = "" + va;
			vb = "" + vb;
			if (va < vb)
				return -1;
			else if (va > vb)
				return 1;
			else
				return 0;
		}
	};
	SysCnds.prototype.ForEachOrdered = function (obj, exp, order)
    {
        var sol = obj.getCurrentSol();
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var instances = foreach_instancestack[foreach_instanceptr];
		cr.shallowAssignArray(instances, sol.getObjects());
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var current_condition = this.runtime.getCurrentCondition();
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
		var i, len, j, lenj, inst, s, sol2;
		for (i = 0, len = instances.length; i < len; i++)
		{
			instances[i].extra["c2_feo_val"] = current_condition.parameters[1].get(i);
		}
		instances.sort(foreach_sortinstances);
		if (order === 1)
			instances.reverse();
		var is_contained = obj.is_contained;
		if (solModifierAfterCnds)
		{
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				inst = instances[i];
				sol = obj.getCurrentSol();
				sol.select_all = false;
				cr.clearArray(sol.instances);
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			sol.select_all = false;
			cr.clearArray(sol.instances);
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				inst = instances[i];
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
			}
		}
		cr.clearArray(instances);
        this.runtime.popLoopStack();
		foreach_instanceptr--;
		return false;
    };
	SysCnds.prototype.PickByComparison = function (obj_, exp_, cmp_, val_)
	{
		var i, len, k, inst;
		if (!obj_)
			return;
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var tmp_instances = foreach_instancestack[foreach_instanceptr];
		var sol = obj_.getCurrentSol();
		cr.shallowAssignArray(tmp_instances, sol.getObjects());
		if (sol.select_all)
			cr.clearArray(sol.else_instances);
		var current_condition = this.runtime.getCurrentCondition();
		for (i = 0, k = 0, len = tmp_instances.length; i < len; i++)
		{
			inst = tmp_instances[i];
			tmp_instances[k] = inst;
			exp_ = current_condition.parameters[1].get(i);
			val_ = current_condition.parameters[3].get(i);
			if (cr.do_cmp(exp_, cmp_, val_))
			{
				k++;
			}
			else
			{
				sol.else_instances.push(inst);
			}
		}
		cr.truncateArray(tmp_instances, k);
		sol.select_all = false;
		cr.shallowAssignArray(sol.instances, tmp_instances);
		cr.clearArray(tmp_instances);
		foreach_instanceptr--;
		obj_.applySolToContainer();
		return !!sol.instances.length;
	};
	SysCnds.prototype.PickByEvaluate = function (obj_, exp_)
	{
		var i, len, k, inst;
		if (!obj_)
			return;
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var tmp_instances = foreach_instancestack[foreach_instanceptr];
		var sol = obj_.getCurrentSol();
		cr.shallowAssignArray(tmp_instances, sol.getObjects());
		if (sol.select_all)
			cr.clearArray(sol.else_instances);
		var current_condition = this.runtime.getCurrentCondition();
		for (i = 0, k = 0, len = tmp_instances.length; i < len; i++)
		{
			inst = tmp_instances[i];
			tmp_instances[k] = inst;
			exp_ = current_condition.parameters[1].get(i);
			if (exp_)
			{
				k++;
			}
			else
			{
				sol.else_instances.push(inst);
			}
		}
		cr.truncateArray(tmp_instances, k);
		sol.select_all = false;
		cr.shallowAssignArray(sol.instances, tmp_instances);
		cr.clearArray(tmp_instances);
		foreach_instanceptr--;
		obj_.applySolToContainer();
		return !!sol.instances.length;
	};
    SysCnds.prototype.TriggerOnce = function ()
    {
        var cndextra = this.runtime.getCurrentCondition().extra;
		if (typeof cndextra["TriggerOnce_lastTick"] === "undefined")
			cndextra["TriggerOnce_lastTick"] = -1;
        var last_tick = cndextra["TriggerOnce_lastTick"];
        var cur_tick = this.runtime.tickcount;
        cndextra["TriggerOnce_lastTick"] = cur_tick;
        return this.runtime.layout_first_tick || last_tick !== cur_tick - 1;
    };
    SysCnds.prototype.Every = function (seconds)
    {
        var cnd = this.runtime.getCurrentCondition();
        var last_time = cnd.extra["Every_lastTime"] || 0;
        var cur_time = this.runtime.kahanTime.sum;
		if (typeof cnd.extra["Every_seconds"] === "undefined")
			cnd.extra["Every_seconds"] = seconds;
		var this_seconds = cnd.extra["Every_seconds"];
        if (cur_time >= last_time + this_seconds)
        {
            cnd.extra["Every_lastTime"] = last_time + this_seconds;
			if (cur_time >= cnd.extra["Every_lastTime"] + 0.04)
			{
				cnd.extra["Every_lastTime"] = cur_time;
			}
			cnd.extra["Every_seconds"] = seconds;
            return true;
        }
		else if (cur_time < last_time - 0.1)
		{
			cnd.extra["Every_lastTime"] = cur_time;
		}
		return false;
    };
    SysCnds.prototype.PickNth = function (obj, index)
    {
        if (!obj)
            return false;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
		index = cr.floor(index);
        if (index < 0 || index >= instances.length)
            return false;
		var inst = instances[index];
        sol.pick_one(inst);
		obj.applySolToContainer();
        return true;
    };
	SysCnds.prototype.PickRandom = function (obj)
    {
        if (!obj)
            return false;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
		var index = cr.floor(Math.random() * instances.length);
        if (index >= instances.length)
            return false;
		var inst = instances[index];
        sol.pick_one(inst);
		obj.applySolToContainer();
        return true;
    };
	SysCnds.prototype.CompareVar = function (v, cmp, val)
    {
        return cr.do_cmp(v.getValue(), cmp, val);
    };
    SysCnds.prototype.IsGroupActive = function (group)
    {
		var g = this.runtime.groups_by_name[group.toLowerCase()];
        return g && g.group_active;
    };
	SysCnds.prototype.IsPreview = function ()
	{
		return typeof cr_is_preview !== "undefined";
	};
	SysCnds.prototype.PickAll = function (obj)
    {
        if (!obj)
            return false;
		if (!obj.instances.length)
			return false;
        var sol = obj.getCurrentSol();
        sol.select_all = true;
		obj.applySolToContainer();
        return true;
    };
	SysCnds.prototype.IsMobile = function ()
	{
		return this.runtime.isMobile;
	};
	SysCnds.prototype.CompareBetween = function (x, a, b)
	{
		return x >= a && x <= b;
	};
	SysCnds.prototype.Else = function ()
	{
		var current_frame = this.runtime.getCurrentEventStack();
		if (current_frame.else_branch_ran)
			return false;		// another event in this else-if chain has run
		else
			return !current_frame.last_event_true;
		/*
		var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var prev_event = current_event.prev_block;
		if (!prev_event)
			return false;
		if (prev_event.is_logical)
			return !this.runtime.last_event_true;
		var i, len, j, lenj, s, sol, temp, inst, any_picked = false;
		for (i = 0, len = prev_event.cndReferences.length; i < len; i++)
		{
			s = prev_event.cndReferences[i];
			sol = s.getCurrentSol();
			if (sol.select_all || sol.instances.length === s.instances.length)
			{
				sol.select_all = false;
				sol.instances.length = 0;
			}
			else
			{
				if (sol.instances.length === 1 && sol.else_instances.length === 0 && s.instances.length >= 2)
				{
					inst = sol.instances[0];
					sol.instances.length = 0;
					for (j = 0, lenj = s.instances.length; j < lenj; j++)
					{
						if (s.instances[j] != inst)
							sol.instances.push(s.instances[j]);
					}
					any_picked = true;
				}
				else
				{
					temp = sol.instances;
					sol.instances = sol.else_instances;
					sol.else_instances = temp;
					any_picked = true;
				}
			}
		}
		return any_picked;
		*/
	};
	SysCnds.prototype.OnLoadFinished = function ()
	{
		return true;
	};
	SysCnds.prototype.OnCanvasSnapshot = function ()
	{
		return true;
	};
	SysCnds.prototype.EffectsSupported = function ()
	{
		return !!this.runtime.glwrap;
	};
	SysCnds.prototype.OnSaveComplete = function ()
	{
		return true;
	};
	SysCnds.prototype.OnSaveFailed = function ()
	{
		return true;
	};
	SysCnds.prototype.OnLoadComplete = function ()
	{
		return true;
	};
	SysCnds.prototype.OnLoadFailed = function ()
	{
		return true;
	};
	SysCnds.prototype.ObjectUIDExists = function (u)
	{
		return !!this.runtime.getObjectByUID(u);
	};
	SysCnds.prototype.IsOnPlatform = function (p)
	{
		var rt = this.runtime;
		switch (p) {
		case 0:		// HTML5 website
			return !rt.isDomFree && !rt.isNodeWebkit && !rt.isCordova && !rt.isWinJS && !rt.isWindowsPhone8 && !rt.isBlackberry10 && !rt.isAmazonWebApp;
		case 1:		// iOS
			return rt.isiOS;
		case 2:		// Android
			return rt.isAndroid;
		case 3:		// Windows 8
			return rt.isWindows8App;
		case 4:		// Windows Phone 8
			return rt.isWindowsPhone8;
		case 5:		// Blackberry 10
			return rt.isBlackberry10;
		case 6:		// Tizen
			return rt.isTizen;
		case 7:		// CocoonJS
			return rt.isCocoonJs;
		case 8:		// Cordova
			return rt.isCordova;
		case 9:	// Scirra Arcade
			return rt.isArcade;
		case 10:	// node-webkit
			return rt.isNodeWebkit;
		case 11:	// crosswalk
			return rt.isCrosswalk;
		case 12:	// amazon webapp
			return rt.isAmazonWebApp;
		case 13:	// windows 10 app
			return rt.isWindows10;
		default:	// should not be possible
			return false;
		}
	};
	var cacheRegex = null;
	var lastRegex = "";
	var lastFlags = "";
	function getRegex(regex_, flags_)
	{
		if (!cacheRegex || regex_ !== lastRegex || flags_ !== lastFlags)
		{
			cacheRegex = new RegExp(regex_, flags_);
			lastRegex = regex_;
			lastFlags = flags_;
		}
		cacheRegex.lastIndex = 0;		// reset
		return cacheRegex;
	};
	SysCnds.prototype.RegexTest = function (str_, regex_, flags_)
	{
		var regex = getRegex(regex_, flags_);
		return regex.test(str_);
	};
	var tmp_arr = [];
	SysCnds.prototype.PickOverlappingPoint = function (obj_, x_, y_)
	{
		if (!obj_)
            return false;
        var sol = obj_.getCurrentSol();
        var instances = sol.getObjects();
		var current_event = this.runtime.getCurrentEventStack().current_event;
		var orblock = current_event.orblock;
		var cnd = this.runtime.getCurrentCondition();
		var i, len, inst, pick;
		if (sol.select_all)
		{
			cr.shallowAssignArray(tmp_arr, instances);
			cr.clearArray(sol.else_instances);
			sol.select_all = false;
			cr.clearArray(sol.instances);
		}
		else
		{
			if (orblock)
			{
				cr.shallowAssignArray(tmp_arr, sol.else_instances);
				cr.clearArray(sol.else_instances);
			}
			else
			{
				cr.shallowAssignArray(tmp_arr, instances);
				cr.clearArray(sol.instances);
			}
		}
		for (i = 0, len = tmp_arr.length; i < len; ++i)
		{
			inst = tmp_arr[i];
			inst.update_bbox();
			pick = cr.xor(inst.contains_pt(x_, y_), cnd.inverted);
			if (pick)
				sol.instances.push(inst);
			else
				sol.else_instances.push(inst);
		}
		obj_.applySolToContainer();
		return cr.xor(!!sol.instances.length, cnd.inverted);
	};
	SysCnds.prototype.IsNaN = function (n)
	{
		return !!isNaN(n);
	};
	SysCnds.prototype.AngleWithin = function (a1, within, a2)
	{
		return cr.angleDiff(cr.to_radians(a1), cr.to_radians(a2)) <= cr.to_radians(within);
	};
	SysCnds.prototype.IsClockwiseFrom = function (a1, a2)
	{
		return cr.angleClockwise(cr.to_radians(a1), cr.to_radians(a2));
	};
	SysCnds.prototype.IsBetweenAngles = function (a, la, ua)
	{
		var angle = cr.to_clamped_radians(a);
		var lower = cr.to_clamped_radians(la);
		var upper = cr.to_clamped_radians(ua);
		var obtuse = (!cr.angleClockwise(upper, lower));
		if (obtuse)
			return !(!cr.angleClockwise(angle, lower) && cr.angleClockwise(angle, upper));
		else
			return cr.angleClockwise(angle, lower) && !cr.angleClockwise(angle, upper);
	};
	SysCnds.prototype.IsValueType = function (x, t)
	{
		if (typeof x === "number")
			return t === 0;
		else		// string
			return t === 1;
	};
	sysProto.cnds = new SysCnds();
    function SysActs() {};
    SysActs.prototype.GoToLayout = function (to)
    {
		if (this.runtime.isloading)
			return;		// cannot change layout while loading on loader layout
		if (this.runtime.changelayout)
			return;		// already changing to a different layout
;
        this.runtime.changelayout = to;
    };
	SysActs.prototype.NextPrevLayout = function (prev)
    {
		if (this.runtime.isloading)
			return;		// cannot change layout while loading on loader layout
		if (this.runtime.changelayout)
			return;		// already changing to a different layout
		var index = this.runtime.layouts_by_index.indexOf(this.runtime.running_layout);
		if (prev && index === 0)
			return;		// cannot go to previous layout from first layout
		if (!prev && index === this.runtime.layouts_by_index.length - 1)
			return;		// cannot go to next layout from last layout
		var to = this.runtime.layouts_by_index[index + (prev ? -1 : 1)];
;
        this.runtime.changelayout = to;
    };
    SysActs.prototype.CreateObject = function (obj, layer, x, y)
    {
        if (!layer || !obj)
            return;
        var inst = this.runtime.createInstance(obj, layer, x, y);
		if (!inst)
			return;
		this.runtime.isInOnDestroy++;
		var i, len, s;
		this.runtime.trigger(Object.getPrototypeOf(obj.plugin).cnds.OnCreated, inst);
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				s = inst.siblings[i];
				this.runtime.trigger(Object.getPrototypeOf(s.type.plugin).cnds.OnCreated, s);
			}
		}
		this.runtime.isInOnDestroy--;
        var sol = obj.getCurrentSol();
        sol.select_all = false;
		cr.clearArray(sol.instances);
		sol.instances[0] = inst;
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				s = inst.siblings[i];
				sol = s.type.getCurrentSol();
				sol.select_all = false;
				cr.clearArray(sol.instances);
				sol.instances[0] = s;
			}
		}
    };
    SysActs.prototype.SetLayerVisible = function (layer, visible_)
    {
        if (!layer)
            return;
		if (layer.visible !== visible_)
		{
			layer.visible = visible_;
			this.runtime.redraw = true;
		}
    };
	SysActs.prototype.SetLayerOpacity = function (layer, opacity_)
	{
		if (!layer)
			return;
		opacity_ = cr.clamp(opacity_ / 100, 0, 1);
		if (layer.opacity !== opacity_)
		{
			layer.opacity = opacity_;
			this.runtime.redraw = true;
		}
	};
	SysActs.prototype.SetLayerScaleRate = function (layer, sr)
	{
		if (!layer)
			return;
		if (layer.zoomRate !== sr)
		{
			layer.zoomRate = sr;
			this.runtime.redraw = true;
		}
	};
	SysActs.prototype.SetLayerForceOwnTexture = function (layer, f)
	{
		if (!layer)
			return;
		f = !!f;
		if (layer.forceOwnTexture !== f)
		{
			layer.forceOwnTexture = f;
			this.runtime.redraw = true;
		}
	};
	SysActs.prototype.SetLayoutScale = function (s)
	{
		if (!this.runtime.running_layout)
			return;
		if (this.runtime.running_layout.scale !== s)
		{
			this.runtime.running_layout.scale = s;
			this.runtime.running_layout.boundScrolling();
			this.runtime.redraw = true;
		}
	};
    SysActs.prototype.ScrollX = function(x)
    {
        this.runtime.running_layout.scrollToX(x);
    };
    SysActs.prototype.ScrollY = function(y)
    {
        this.runtime.running_layout.scrollToY(y);
    };
    SysActs.prototype.Scroll = function(x, y)
    {
        this.runtime.running_layout.scrollToX(x);
        this.runtime.running_layout.scrollToY(y);
    };
    SysActs.prototype.ScrollToObject = function(obj)
    {
        var inst = obj.getFirstPicked();
        if (inst)
        {
            this.runtime.running_layout.scrollToX(inst.x);
            this.runtime.running_layout.scrollToY(inst.y);
        }
    };
	SysActs.prototype.SetVar = function(v, x)
	{
;
		if (v.vartype === 0)
		{
			if (cr.is_number(x))
				v.setValue(x);
			else
				v.setValue(parseFloat(x));
		}
		else if (v.vartype === 1)
			v.setValue(x.toString());
	};
	SysActs.prototype.AddVar = function(v, x)
	{
;
		if (v.vartype === 0)
		{
			if (cr.is_number(x))
				v.setValue(v.getValue() + x);
			else
				v.setValue(v.getValue() + parseFloat(x));
		}
		else if (v.vartype === 1)
			v.setValue(v.getValue() + x.toString());
	};
	SysActs.prototype.SubVar = function(v, x)
	{
;
		if (v.vartype === 0)
		{
			if (cr.is_number(x))
				v.setValue(v.getValue() - x);
			else
				v.setValue(v.getValue() - parseFloat(x));
		}
	};
    SysActs.prototype.SetGroupActive = function (group, active)
    {
		var g = this.runtime.groups_by_name[group.toLowerCase()];
		if (!g)
			return;
		switch (active) {
		case 0:
			g.setGroupActive(false);
			break;
		case 1:
			g.setGroupActive(true);
			break;
		case 2:
			g.setGroupActive(!g.group_active);
			break;
		}
    };
    SysActs.prototype.SetTimescale = function (ts_)
    {
        var ts = ts_;
        if (ts < 0)
            ts = 0;
        this.runtime.timescale = ts;
    };
    SysActs.prototype.SetObjectTimescale = function (obj, ts_)
    {
        var ts = ts_;
        if (ts < 0)
            ts = 0;
        if (!obj)
            return;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
        var i, len;
        for (i = 0, len = instances.length; i < len; i++)
        {
            instances[i].my_timescale = ts;
        }
    };
    SysActs.prototype.RestoreObjectTimescale = function (obj)
    {
        if (!obj)
            return false;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
        var i, len;
        for (i = 0, len = instances.length; i < len; i++)
        {
            instances[i].my_timescale = -1.0;
        }
    };
	var waitobjrecycle = [];
	function allocWaitObject()
	{
		var w;
		if (waitobjrecycle.length)
			w = waitobjrecycle.pop();
		else
		{
			w = {};
			w.sols = {};
			w.solModifiers = [];
		}
		w.deleteme = false;
		return w;
	};
	function freeWaitObject(w)
	{
		cr.wipe(w.sols);
		cr.clearArray(w.solModifiers);
		waitobjrecycle.push(w);
	};
	var solstateobjects = [];
	function allocSolStateObject()
	{
		var s;
		if (solstateobjects.length)
			s = solstateobjects.pop();
		else
		{
			s = {};
			s.insts = [];
		}
		s.sa = false;
		return s;
	};
	function freeSolStateObject(s)
	{
		cr.clearArray(s.insts);
		solstateobjects.push(s);
	};
	SysActs.prototype.Wait = function (seconds)
	{
		if (seconds < 0)
			return;
		var i, len, s, t, ss;
		var evinfo = this.runtime.getCurrentEventStack();
		var waitobj = allocWaitObject();
		waitobj.time = this.runtime.kahanTime.sum + seconds;
		waitobj.signaltag = "";
		waitobj.signalled = false;
		waitobj.ev = evinfo.current_event;
		waitobj.actindex = evinfo.actindex + 1;	// pointing at next action
		for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
		{
			t = this.runtime.types_by_index[i];
			s = t.getCurrentSol();
			if (s.select_all && evinfo.current_event.solModifiers.indexOf(t) === -1)
				continue;
			waitobj.solModifiers.push(t);
			ss = allocSolStateObject();
			ss.sa = s.select_all;
			cr.shallowAssignArray(ss.insts, s.instances);
			waitobj.sols[i.toString()] = ss;
		}
		this.waits.push(waitobj);
		return true;
	};
	SysActs.prototype.WaitForSignal = function (tag)
	{
		var i, len, s, t, ss;
		var evinfo = this.runtime.getCurrentEventStack();
		var waitobj = allocWaitObject();
		waitobj.time = -1;
		waitobj.signaltag = tag.toLowerCase();
		waitobj.signalled = false;
		waitobj.ev = evinfo.current_event;
		waitobj.actindex = evinfo.actindex + 1;	// pointing at next action
		for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
		{
			t = this.runtime.types_by_index[i];
			s = t.getCurrentSol();
			if (s.select_all && evinfo.current_event.solModifiers.indexOf(t) === -1)
				continue;
			waitobj.solModifiers.push(t);
			ss = allocSolStateObject();
			ss.sa = s.select_all;
			cr.shallowAssignArray(ss.insts, s.instances);
			waitobj.sols[i.toString()] = ss;
		}
		this.waits.push(waitobj);
		return true;
	};
	SysActs.prototype.Signal = function (tag)
	{
		var lowertag = tag.toLowerCase();
		var i, len, w;
		for (i = 0, len = this.waits.length; i < len; ++i)
		{
			w = this.waits[i];
			if (w.time !== -1)
				continue;					// timer wait, ignore
			if (w.signaltag === lowertag)	// waiting for this signal
				w.signalled = true;			// will run on next check
		}
	};
	SysActs.prototype.SetLayerScale = function (layer, scale)
    {
        if (!layer)
            return;
		if (layer.scale === scale)
			return;
        layer.scale = scale;
        this.runtime.redraw = true;
    };
	SysActs.prototype.ResetGlobals = function ()
	{
		var i, len, g;
		for (i = 0, len = this.runtime.all_global_vars.length; i < len; i++)
		{
			g = this.runtime.all_global_vars[i];
			g.data = g.initial;
		}
	};
	SysActs.prototype.SetLayoutAngle = function (a)
	{
		a = cr.to_radians(a);
		a = cr.clamp_angle(a);
		if (this.runtime.running_layout)
		{
			if (this.runtime.running_layout.angle !== a)
			{
				this.runtime.running_layout.angle = a;
				this.runtime.redraw = true;
			}
		}
	};
	SysActs.prototype.SetLayerAngle = function (layer, a)
    {
        if (!layer)
            return;
		a = cr.to_radians(a);
		a = cr.clamp_angle(a);
		if (layer.angle === a)
			return;
        layer.angle = a;
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerParallax = function (layer, px, py)
    {
        if (!layer)
            return;
		if (layer.parallaxX === px / 100 && layer.parallaxY === py / 100)
			return;
        layer.parallaxX = px / 100;
		layer.parallaxY = py / 100;
		if (layer.parallaxX !== 1 || layer.parallaxY !== 1)
		{
			var i, len, instances = layer.instances;
			for (i = 0, len = instances.length; i < len; ++i)
			{
				instances[i].type.any_instance_parallaxed = true;
			}
		}
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerBackground = function (layer, c)
    {
        if (!layer)
            return;
		var r = cr.GetRValue(c);
		var g = cr.GetGValue(c);
		var b = cr.GetBValue(c);
		if (layer.background_color[0] === r && layer.background_color[1] === g && layer.background_color[2] === b)
			return;
        layer.background_color[0] = r;
		layer.background_color[1] = g;
		layer.background_color[2] = b;
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerTransparent = function (layer, t)
    {
        if (!layer)
            return;
		if (!!t === !!layer.transparent)
			return;
		layer.transparent = !!t;
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerBlendMode = function (layer, bm)
    {
        if (!layer)
            return;
		if (layer.blend_mode === bm)
			return;
		layer.blend_mode = bm;
		layer.compositeOp = cr.effectToCompositeOp(layer.blend_mode);
		if (this.runtime.gl)
			cr.setGLBlend(layer, layer.blend_mode, this.runtime.gl);
        this.runtime.redraw = true;
    };
	SysActs.prototype.StopLoop = function ()
	{
		if (this.runtime.loop_stack_index < 0)
			return;		// no loop currently running
		this.runtime.getCurrentLoop().stopped = true;
	};
	SysActs.prototype.GoToLayoutByName = function (layoutname)
	{
		if (this.runtime.isloading)
			return;		// cannot change layout while loading on loader layout
		if (this.runtime.changelayout)
			return;		// already changing to different layout
;
		var l;
		for (l in this.runtime.layouts)
		{
			if (this.runtime.layouts.hasOwnProperty(l) && cr.equals_nocase(l, layoutname))
			{
				this.runtime.changelayout = this.runtime.layouts[l];
				return;
			}
		}
	};
	SysActs.prototype.RestartLayout = function (layoutname)
	{
		if (this.runtime.isloading)
			return;		// cannot restart loader layouts
		if (this.runtime.changelayout)
			return;		// already changing to a different layout
;
		if (!this.runtime.running_layout)
			return;
		this.runtime.changelayout = this.runtime.running_layout;
		var i, len, g;
		for (i = 0, len = this.runtime.allGroups.length; i < len; i++)
		{
			g = this.runtime.allGroups[i];
			g.setGroupActive(g.initially_activated);
		}
	};
	SysActs.prototype.SnapshotCanvas = function (format_, quality_)
	{
		this.runtime.doCanvasSnapshot(format_ === 0 ? "image/png" : "image/jpeg", quality_ / 100);
	};
	SysActs.prototype.SetCanvasSize = function (w, h)
	{
		if (w <= 0 || h <= 0)
			return;
		var mode = this.runtime.fullscreen_mode;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || this.runtime.isNodeFullscreen);
		if (isfullscreen && this.runtime.fullscreen_scaling > 0)
			mode = this.runtime.fullscreen_scaling;
		if (mode === 0)
		{
			this.runtime["setSize"](w, h, true);
		}
		else
		{
			this.runtime.original_width = w;
			this.runtime.original_height = h;
			this.runtime["setSize"](this.runtime.lastWindowWidth, this.runtime.lastWindowHeight, true);
		}
	};
	SysActs.prototype.SetLayoutEffectEnabled = function (enable_, effectname_)
	{
		if (!this.runtime.running_layout || !this.runtime.glwrap)
			return;
		var et = this.runtime.running_layout.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var enable = (enable_ === 1);
		if (et.active == enable)
			return;		// no change
		et.active = enable;
		this.runtime.running_layout.updateActiveEffects();
		this.runtime.redraw = true;
	};
	SysActs.prototype.SetLayerEffectEnabled = function (layer, enable_, effectname_)
	{
		if (!layer || !this.runtime.glwrap)
			return;
		var et = layer.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var enable = (enable_ === 1);
		if (et.active == enable)
			return;		// no change
		et.active = enable;
		layer.updateActiveEffects();
		this.runtime.redraw = true;
	};
	SysActs.prototype.SetLayoutEffectParam = function (effectname_, index_, value_)
	{
		if (!this.runtime.running_layout || !this.runtime.glwrap)
			return;
		var et = this.runtime.running_layout.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var params = this.runtime.running_layout.effect_params[et.index];
		index_ = Math.floor(index_);
		if (index_ < 0 || index_ >= params.length)
			return;		// effect index out of bounds
		if (this.runtime.glwrap.getProgramParameterType(et.shaderindex, index_) === 1)
			value_ /= 100.0;
		if (params[index_] === value_)
			return;		// no change
		params[index_] = value_;
		if (et.active)
			this.runtime.redraw = true;
	};
	SysActs.prototype.SetLayerEffectParam = function (layer, effectname_, index_, value_)
	{
		if (!layer || !this.runtime.glwrap)
			return;
		var et = layer.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var params = layer.effect_params[et.index];
		index_ = Math.floor(index_);
		if (index_ < 0 || index_ >= params.length)
			return;		// effect index out of bounds
		if (this.runtime.glwrap.getProgramParameterType(et.shaderindex, index_) === 1)
			value_ /= 100.0;
		if (params[index_] === value_)
			return;		// no change
		params[index_] = value_;
		if (et.active)
			this.runtime.redraw = true;
	};
	SysActs.prototype.SaveState = function (slot_)
	{
		this.runtime.saveToSlot = slot_;
	};
	SysActs.prototype.LoadState = function (slot_)
	{
		this.runtime.loadFromSlot = slot_;
	};
	SysActs.prototype.LoadStateJSON = function (jsonstr_)
	{
		this.runtime.loadFromJson = jsonstr_;
	};
	SysActs.prototype.SetHalfFramerateMode = function (set_)
	{
		this.runtime.halfFramerateMode = (set_ !== 0);
	};
	SysActs.prototype.SetFullscreenQuality = function (q)
	{
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || this.isNodeFullscreen);
		if (!isfullscreen && this.runtime.fullscreen_mode === 0)
			return;
		this.runtime.wantFullscreenScalingQuality = (q !== 0);
		this.runtime["setSize"](this.runtime.lastWindowWidth, this.runtime.lastWindowHeight, true);
	};
	SysActs.prototype.ResetPersisted = function ()
	{
		var i, len;
		for (i = 0, len = this.runtime.layouts_by_index.length; i < len; ++i)
		{
			this.runtime.layouts_by_index[i].persist_data = {};
			this.runtime.layouts_by_index[i].first_visit = true;
		}
	};
	SysActs.prototype.RecreateInitialObjects = function (obj, x1, y1, x2, y2)
	{
		if (!obj)
			return;
		this.runtime.running_layout.recreateInitialObjects(obj, x1, y1, x2, y2);
	};
	SysActs.prototype.SetPixelRounding = function (m)
	{
		this.runtime.pixel_rounding = (m !== 0);
		this.runtime.redraw = true;
	};
	SysActs.prototype.SetMinimumFramerate = function (f)
	{
		if (f < 1)
			f = 1;
		if (f > 120)
			f = 120;
		this.runtime.minimumFramerate = f;
	};
	function SortZOrderList(a, b)
	{
		var layerA = a[0];
		var layerB = b[0];
		var diff = layerA - layerB;
		if (diff !== 0)
			return diff;
		var indexA = a[1];
		var indexB = b[1];
		return indexA - indexB;
	};
	function SortInstancesByValue(a, b)
	{
		return a[1] - b[1];
	};
	SysActs.prototype.SortZOrderByInstVar = function (obj, iv)
	{
		if (!obj)
			return;
		var i, len, inst, value, r, layer, toZ;
		var sol = obj.getCurrentSol();
		var pickedInstances = sol.getObjects();
		var zOrderList = [];
		var instValues = [];
		var layout = this.runtime.running_layout;
		var isFamily = obj.is_family;
		var familyIndex = obj.family_index;
		for (i = 0, len = pickedInstances.length; i < len; ++i)
		{
			inst = pickedInstances[i];
			if (!inst.layer)
				continue;		// not a world instance
			if (isFamily)
				value = inst.instance_vars[iv + inst.type.family_var_map[familyIndex]];
			else
				value = inst.instance_vars[iv];
			zOrderList.push([
				inst.layer.index,
				inst.get_zindex()
			]);
			instValues.push([
				inst,
				value
			]);
		}
		if (!zOrderList.length)
			return;				// no instances were world instances
		zOrderList.sort(SortZOrderList);
		instValues.sort(SortInstancesByValue);
		for (i = 0, len = zOrderList.length; i < len; ++i)
		{
			inst = instValues[i][0];					// instance in the order we want
			layer = layout.layers[zOrderList[i][0]];	// layer to put it on
			toZ = zOrderList[i][1];						// Z index on that layer to put it
			if (layer.instances[toZ] !== inst)			// not already got this instance there
			{
				layer.instances[toZ] = inst;			// update instance
				inst.layer = layer;						// update instance's layer reference (could have changed)
				layer.setZIndicesStaleFrom(toZ);		// mark Z indices stale from this point since they have changed
			}
		}
	};
	sysProto.acts = new SysActs();
    function SysExps() {};
    SysExps.prototype["int"] = function(ret, x)
    {
        if (cr.is_string(x))
        {
            ret.set_int(parseInt(x, 10));
            if (isNaN(ret.data))
                ret.data = 0;
        }
        else
            ret.set_int(x);
    };
    SysExps.prototype["float"] = function(ret, x)
    {
        if (cr.is_string(x))
        {
            ret.set_float(parseFloat(x));
            if (isNaN(ret.data))
                ret.data = 0;
        }
        else
            ret.set_float(x);
    };
    SysExps.prototype.str = function(ret, x)
    {
        if (cr.is_string(x))
            ret.set_string(x);
        else
            ret.set_string(x.toString());
    };
    SysExps.prototype.len = function(ret, x)
    {
        ret.set_int(x.length || 0);
    };
    SysExps.prototype.random = function (ret, a, b)
    {
        if (b === undefined)
        {
            ret.set_float(Math.random() * a);
        }
        else
        {
            ret.set_float(Math.random() * (b - a) + a);
        }
    };
    SysExps.prototype.sqrt = function(ret, x)
    {
        ret.set_float(Math.sqrt(x));
    };
    SysExps.prototype.abs = function(ret, x)
    {
        ret.set_float(Math.abs(x));
    };
    SysExps.prototype.round = function(ret, x)
    {
        ret.set_int(Math.round(x));
    };
    SysExps.prototype.floor = function(ret, x)
    {
        ret.set_int(Math.floor(x));
    };
    SysExps.prototype.ceil = function(ret, x)
    {
        ret.set_int(Math.ceil(x));
    };
    SysExps.prototype.sin = function(ret, x)
    {
        ret.set_float(Math.sin(cr.to_radians(x)));
    };
    SysExps.prototype.cos = function(ret, x)
    {
        ret.set_float(Math.cos(cr.to_radians(x)));
    };
    SysExps.prototype.tan = function(ret, x)
    {
        ret.set_float(Math.tan(cr.to_radians(x)));
    };
    SysExps.prototype.asin = function(ret, x)
    {
        ret.set_float(cr.to_degrees(Math.asin(x)));
    };
    SysExps.prototype.acos = function(ret, x)
    {
        ret.set_float(cr.to_degrees(Math.acos(x)));
    };
    SysExps.prototype.atan = function(ret, x)
    {
        ret.set_float(cr.to_degrees(Math.atan(x)));
    };
    SysExps.prototype.exp = function(ret, x)
    {
        ret.set_float(Math.exp(x));
    };
    SysExps.prototype.ln = function(ret, x)
    {
        ret.set_float(Math.log(x));
    };
    SysExps.prototype.log10 = function(ret, x)
    {
        ret.set_float(Math.log(x) / Math.LN10);
    };
    SysExps.prototype.max = function(ret)
    {
		var max_ = arguments[1];
		if (typeof max_ !== "number")
			max_ = 0;
		var i, len, a;
		for (i = 2, len = arguments.length; i < len; i++)
		{
			a = arguments[i];
			if (typeof a !== "number")
				continue;		// ignore non-numeric types
			if (max_ < a)
				max_ = a;
		}
		ret.set_float(max_);
    };
    SysExps.prototype.min = function(ret)
    {
        var min_ = arguments[1];
		if (typeof min_ !== "number")
			min_ = 0;
		var i, len, a;
		for (i = 2, len = arguments.length; i < len; i++)
		{
			a = arguments[i];
			if (typeof a !== "number")
				continue;		// ignore non-numeric types
			if (min_ > a)
				min_ = a;
		}
		ret.set_float(min_);
    };
    SysExps.prototype.dt = function(ret)
    {
        ret.set_float(this.runtime.dt);
    };
    SysExps.prototype.timescale = function(ret)
    {
        ret.set_float(this.runtime.timescale);
    };
    SysExps.prototype.wallclocktime = function(ret)
    {
        ret.set_float((Date.now() - this.runtime.start_time) / 1000.0);
    };
    SysExps.prototype.time = function(ret)
    {
        ret.set_float(this.runtime.kahanTime.sum);
    };
    SysExps.prototype.tickcount = function(ret)
    {
        ret.set_int(this.runtime.tickcount);
    };
    SysExps.prototype.objectcount = function(ret)
    {
        ret.set_int(this.runtime.objectcount);
    };
    SysExps.prototype.fps = function(ret)
    {
        ret.set_int(this.runtime.fps);
    };
    SysExps.prototype.loopindex = function(ret, name_)
    {
		var loop, i, len;
        if (!this.runtime.loop_stack.length)
        {
            ret.set_int(0);
            return;
        }
        if (name_)
        {
            for (i = this.runtime.loop_stack_index; i >= 0; --i)
            {
                loop = this.runtime.loop_stack[i];
                if (loop.name === name_)
                {
                    ret.set_int(loop.index);
                    return;
                }
            }
            ret.set_int(0);
        }
        else
        {
			loop = this.runtime.getCurrentLoop();
			ret.set_int(loop ? loop.index : -1);
        }
    };
    SysExps.prototype.distance = function(ret, x1, y1, x2, y2)
    {
        ret.set_float(cr.distanceTo(x1, y1, x2, y2));
    };
    SysExps.prototype.angle = function(ret, x1, y1, x2, y2)
    {
        ret.set_float(cr.to_degrees(cr.angleTo(x1, y1, x2, y2)));
    };
    SysExps.prototype.scrollx = function(ret)
    {
        ret.set_float(this.runtime.running_layout.scrollX);
    };
    SysExps.prototype.scrolly = function(ret)
    {
        ret.set_float(this.runtime.running_layout.scrollY);
    };
    SysExps.prototype.newline = function(ret)
    {
        ret.set_string("\n");
    };
    SysExps.prototype.lerp = function(ret, a, b, x)
    {
        ret.set_float(cr.lerp(a, b, x));
    };
	SysExps.prototype.qarp = function(ret, a, b, c, x)
    {
        ret.set_float(cr.qarp(a, b, c, x));
    };
	SysExps.prototype.cubic = function(ret, a, b, c, d, x)
    {
        ret.set_float(cr.cubic(a, b, c, d, x));
    };
	SysExps.prototype.cosp = function(ret, a, b, x)
    {
        ret.set_float(cr.cosp(a, b, x));
    };
    SysExps.prototype.windowwidth = function(ret)
    {
        ret.set_int(this.runtime.width);
    };
    SysExps.prototype.windowheight = function(ret)
    {
        ret.set_int(this.runtime.height);
    };
	SysExps.prototype.uppercase = function(ret, str)
	{
		ret.set_string(cr.is_string(str) ? str.toUpperCase() : "");
	};
	SysExps.prototype.lowercase = function(ret, str)
	{
		ret.set_string(cr.is_string(str) ? str.toLowerCase() : "");
	};
	SysExps.prototype.clamp = function(ret, x, l, u)
	{
		if (x < l)
			ret.set_float(l);
		else if (x > u)
			ret.set_float(u);
		else
			ret.set_float(x);
	};
	SysExps.prototype.layerscale = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.scale);
	};
	SysExps.prototype.layeropacity = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.opacity * 100);
	};
	SysExps.prototype.layerscalerate = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.zoomRate);
	};
	SysExps.prototype.layerparallaxx = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.parallaxX * 100);
	};
	SysExps.prototype.layerparallaxy = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.parallaxY * 100);
	};
	SysExps.prototype.layerindex = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_int(-1);
		else
			ret.set_int(layer.index);
	};
	SysExps.prototype.layoutscale = function (ret)
	{
		if (this.runtime.running_layout)
			ret.set_float(this.runtime.running_layout.scale);
		else
			ret.set_float(0);
	};
	SysExps.prototype.layoutangle = function (ret)
	{
		ret.set_float(cr.to_degrees(this.runtime.running_layout.angle));
	};
	SysExps.prototype.layerangle = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(cr.to_degrees(layer.angle));
	};
	SysExps.prototype.layoutwidth = function (ret)
	{
		ret.set_int(this.runtime.running_layout.width);
	};
	SysExps.prototype.layoutheight = function (ret)
	{
		ret.set_int(this.runtime.running_layout.height);
	};
	SysExps.prototype.find = function (ret, text, searchstr)
	{
		if (cr.is_string(text) && cr.is_string(searchstr))
			ret.set_int(text.search(new RegExp(cr.regexp_escape(searchstr), "i")));
		else
			ret.set_int(-1);
	};
	SysExps.prototype.findcase = function (ret, text, searchstr)
	{
		if (cr.is_string(text) && cr.is_string(searchstr))
			ret.set_int(text.search(new RegExp(cr.regexp_escape(searchstr), "")));
		else
			ret.set_int(-1);
	};
	SysExps.prototype.left = function (ret, text, n)
	{
		ret.set_string(cr.is_string(text) ? text.substr(0, n) : "");
	};
	SysExps.prototype.right = function (ret, text, n)
	{
		ret.set_string(cr.is_string(text) ? text.substr(text.length - n) : "");
	};
	SysExps.prototype.mid = function (ret, text, index_, length_)
	{
		ret.set_string(cr.is_string(text) ? text.substr(index_, length_) : "");
	};
	SysExps.prototype.tokenat = function (ret, text, index_, sep)
	{
		if (cr.is_string(text) && cr.is_string(sep))
		{
			var arr = text.split(sep);
			var i = cr.floor(index_);
			if (i < 0 || i >= arr.length)
				ret.set_string("");
			else
				ret.set_string(arr[i]);
		}
		else
			ret.set_string("");
	};
	SysExps.prototype.tokencount = function (ret, text, sep)
	{
		if (cr.is_string(text) && text.length)
			ret.set_int(text.split(sep).length);
		else
			ret.set_int(0);
	};
	SysExps.prototype.replace = function (ret, text, find_, replace_)
	{
		if (cr.is_string(text) && cr.is_string(find_) && cr.is_string(replace_))
			ret.set_string(text.replace(new RegExp(cr.regexp_escape(find_), "gi"), replace_));
		else
			ret.set_string(cr.is_string(text) ? text : "");
	};
	SysExps.prototype.trim = function (ret, text)
	{
		ret.set_string(cr.is_string(text) ? text.trim() : "");
	};
	SysExps.prototype.pi = function (ret)
	{
		ret.set_float(cr.PI);
	};
	SysExps.prototype.layoutname = function (ret)
	{
		if (this.runtime.running_layout)
			ret.set_string(this.runtime.running_layout.name);
		else
			ret.set_string("");
	};
	SysExps.prototype.renderer = function (ret)
	{
		ret.set_string(this.runtime.gl ? "webgl" : "canvas2d");
	};
	SysExps.prototype.rendererdetail = function (ret)
	{
		ret.set_string(this.runtime.glUnmaskedRenderer);
	};
	SysExps.prototype.anglediff = function (ret, a, b)
	{
		ret.set_float(cr.to_degrees(cr.angleDiff(cr.to_radians(a), cr.to_radians(b))));
	};
	SysExps.prototype.choose = function (ret)
	{
		var index = cr.floor(Math.random() * (arguments.length - 1));
		ret.set_any(arguments[index + 1]);
	};
	SysExps.prototype.rgb = function (ret, r, g, b)
	{
		ret.set_int(cr.RGB(r, g, b));
	};
	SysExps.prototype.projectversion = function (ret)
	{
		ret.set_string(this.runtime.versionstr);
	};
	SysExps.prototype.projectname = function (ret)
	{
		ret.set_string(this.runtime.projectName);
	};
	SysExps.prototype.anglelerp = function (ret, a, b, x)
	{
		a = cr.to_radians(a);
		b = cr.to_radians(b);
		var diff = cr.angleDiff(a, b);
		if (cr.angleClockwise(b, a))
		{
			ret.set_float(cr.to_clamped_degrees(a + diff * x));
		}
		else
		{
			ret.set_float(cr.to_clamped_degrees(a - diff * x));
		}
	};
	SysExps.prototype.anglerotate = function (ret, a, b, c)
	{
		a = cr.to_radians(a);
		b = cr.to_radians(b);
		c = cr.to_radians(c);
		ret.set_float(cr.to_clamped_degrees(cr.angleRotate(a, b, c)));
	};
	SysExps.prototype.zeropad = function (ret, n, d)
	{
		var s = (n < 0 ? "-" : "");
		if (n < 0) n = -n;
		var zeroes = d - n.toString().length;
		for (var i = 0; i < zeroes; i++)
			s += "0";
		ret.set_string(s + n.toString());
	};
	SysExps.prototype.cpuutilisation = function (ret)
	{
		ret.set_float(this.runtime.cpuutilisation / 1000);
	};
	SysExps.prototype.viewportleft = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewLeft : 0);
	};
	SysExps.prototype.viewporttop = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewTop : 0);
	};
	SysExps.prototype.viewportright = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewRight : 0);
	};
	SysExps.prototype.viewportbottom = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewBottom : 0);
	};
	SysExps.prototype.loadingprogress = function (ret)
	{
		ret.set_float(this.runtime.loadingprogress);
	};
	SysExps.prototype.unlerp = function(ret, a, b, y)
    {
        ret.set_float(cr.unlerp(a, b, y));
    };
	SysExps.prototype.canvassnapshot = function (ret)
	{
		ret.set_string(this.runtime.snapshotData);
	};
	SysExps.prototype.urlencode = function (ret, s)
	{
		ret.set_string(encodeURIComponent(s));
	};
	SysExps.prototype.urldecode = function (ret, s)
	{
		ret.set_string(decodeURIComponent(s));
	};
	SysExps.prototype.canvastolayerx = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.canvasToLayer(x, y, true) : 0);
	};
	SysExps.prototype.canvastolayery = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.canvasToLayer(x, y, false) : 0);
	};
	SysExps.prototype.layertocanvasx = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.layerToCanvas(x, y, true) : 0);
	};
	SysExps.prototype.layertocanvasy = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.layerToCanvas(x, y, false) : 0);
	};
	SysExps.prototype.savestatejson = function (ret)
	{
		ret.set_string(this.runtime.lastSaveJson);
	};
	SysExps.prototype.imagememoryusage = function (ret)
	{
		if (this.runtime.glwrap)
			ret.set_float(Math.round(100 * this.runtime.glwrap.estimateVRAM() / (1024 * 1024)) / 100);
		else
			ret.set_float(0);
	};
	SysExps.prototype.regexsearch = function (ret, str_, regex_, flags_)
	{
		var regex = getRegex(regex_, flags_);
		ret.set_int(str_ ? str_.search(regex) : -1);
	};
	SysExps.prototype.regexreplace = function (ret, str_, regex_, flags_, replace_)
	{
		var regex = getRegex(regex_, flags_);
		ret.set_string(str_ ? str_.replace(regex, replace_) : "");
	};
	var regexMatches = [];
	var lastMatchesStr = "";
	var lastMatchesRegex = "";
	var lastMatchesFlags = "";
	function updateRegexMatches(str_, regex_, flags_)
	{
		if (str_ === lastMatchesStr && regex_ === lastMatchesRegex && flags_ === lastMatchesFlags)
			return;
		var regex = getRegex(regex_, flags_);
		regexMatches = str_.match(regex);
		lastMatchesStr = str_;
		lastMatchesRegex = regex_;
		lastMatchesFlags = flags_;
	};
	SysExps.prototype.regexmatchcount = function (ret, str_, regex_, flags_)
	{
		var regex = getRegex(regex_, flags_);
		updateRegexMatches(str_.toString(), regex_, flags_);
		ret.set_int(regexMatches ? regexMatches.length : 0);
	};
	SysExps.prototype.regexmatchat = function (ret, str_, regex_, flags_, index_)
	{
		index_ = Math.floor(index_);
		var regex = getRegex(regex_, flags_);
		updateRegexMatches(str_.toString(), regex_, flags_);
		if (!regexMatches || index_ < 0 || index_ >= regexMatches.length)
			ret.set_string("");
		else
			ret.set_string(regexMatches[index_]);
	};
	SysExps.prototype.infinity = function (ret)
	{
		ret.set_float(Infinity);
	};
	SysExps.prototype.setbit = function (ret, n, b, v)
	{
		n = n | 0;
		b = b | 0;
		v = (v !== 0 ? 1 : 0);
		ret.set_int((n & ~(1 << b)) | (v << b));
	};
	SysExps.prototype.togglebit = function (ret, n, b)
	{
		n = n | 0;
		b = b | 0;
		ret.set_int(n ^ (1 << b));
	};
	SysExps.prototype.getbit = function (ret, n, b)
	{
		n = n | 0;
		b = b | 0;
		ret.set_int((n & (1 << b)) ? 1 : 0);
	};
	SysExps.prototype.originalwindowwidth = function (ret)
	{
		ret.set_int(this.runtime.original_width);
	};
	SysExps.prototype.originalwindowheight = function (ret)
	{
		ret.set_int(this.runtime.original_height);
	};
	sysProto.exps = new SysExps();
	sysProto.runWaits = function ()
	{
		var i, j, len, w, k, s, ss;
		var evinfo = this.runtime.getCurrentEventStack();
		for (i = 0, len = this.waits.length; i < len; i++)
		{
			w = this.waits[i];
			if (w.time === -1)		// signalled wait
			{
				if (!w.signalled)
					continue;		// not yet signalled
			}
			else					// timer wait
			{
				if (w.time > this.runtime.kahanTime.sum)
					continue;		// timer not yet expired
			}
			evinfo.current_event = w.ev;
			evinfo.actindex = w.actindex;
			evinfo.cndindex = 0;
			for (k in w.sols)
			{
				if (w.sols.hasOwnProperty(k))
				{
					s = this.runtime.types_by_index[parseInt(k, 10)].getCurrentSol();
					ss = w.sols[k];
					s.select_all = ss.sa;
					cr.shallowAssignArray(s.instances, ss.insts);
					freeSolStateObject(ss);
				}
			}
			w.ev.resume_actions_and_subevents();
			this.runtime.clearSol(w.solModifiers);
			w.deleteme = true;
		}
		for (i = 0, j = 0, len = this.waits.length; i < len; i++)
		{
			w = this.waits[i];
			this.waits[j] = w;
			if (w.deleteme)
				freeWaitObject(w);
			else
				j++;
		}
		cr.truncateArray(this.waits, j);
	};
}());
;
(function () {
	cr.add_common_aces = function (m, pluginProto)
	{
		var singleglobal_ = m[1];
		var position_aces = m[3];
		var size_aces = m[4];
		var angle_aces = m[5];
		var appearance_aces = m[6];
		var zorder_aces = m[7];
		var effects_aces = m[8];
		if (!pluginProto.cnds)
			pluginProto.cnds = {};
		if (!pluginProto.acts)
			pluginProto.acts = {};
		if (!pluginProto.exps)
			pluginProto.exps = {};
		var cnds = pluginProto.cnds;
		var acts = pluginProto.acts;
		var exps = pluginProto.exps;
		if (position_aces)
		{
			cnds.CompareX = function (cmp, x)
			{
				return cr.do_cmp(this.x, cmp, x);
			};
			cnds.CompareY = function (cmp, y)
			{
				return cr.do_cmp(this.y, cmp, y);
			};
			cnds.IsOnScreen = function ()
			{
				var layer = this.layer;
				this.update_bbox();
				var bbox = this.bbox;
				return !(bbox.right < layer.viewLeft || bbox.bottom < layer.viewTop || bbox.left > layer.viewRight || bbox.top > layer.viewBottom);
			};
			cnds.IsOutsideLayout = function ()
			{
				this.update_bbox();
				var bbox = this.bbox;
				var layout = this.runtime.running_layout;
				return (bbox.right < 0 || bbox.bottom < 0 || bbox.left > layout.width || bbox.top > layout.height);
			};
			cnds.PickDistance = function (which, x, y)
			{
				var sol = this.getCurrentSol();
				var instances = sol.getObjects();
				if (!instances.length)
					return false;
				var inst = instances[0];
				var pickme = inst;
				var dist = cr.distanceTo(inst.x, inst.y, x, y);
				var i, len, d;
				for (i = 1, len = instances.length; i < len; i++)
				{
					inst = instances[i];
					d = cr.distanceTo(inst.x, inst.y, x, y);
					if ((which === 0 && d < dist) || (which === 1 && d > dist))
					{
						dist = d;
						pickme = inst;
					}
				}
				sol.pick_one(pickme);
				return true;
			};
			acts.SetX = function (x)
			{
				if (this.x !== x)
				{
					this.x = x;
					this.set_bbox_changed();
				}
			};
			acts.SetY = function (y)
			{
				if (this.y !== y)
				{
					this.y = y;
					this.set_bbox_changed();
				}
			};
			acts.SetPos = function (x, y)
			{
				if (this.x !== x || this.y !== y)
				{
					this.x = x;
					this.y = y;
					this.set_bbox_changed();
				}
			};
			acts.SetPosToObject = function (obj, imgpt)
			{
				var inst = obj.getPairedInstance(this);
				if (!inst)
					return;
				var newx, newy;
				if (inst.getImagePoint)
				{
					newx = inst.getImagePoint(imgpt, true);
					newy = inst.getImagePoint(imgpt, false);
				}
				else
				{
					newx = inst.x;
					newy = inst.y;
				}
				if (this.x !== newx || this.y !== newy)
				{
					this.x = newx;
					this.y = newy;
					this.set_bbox_changed();
				}
			};
			acts.MoveForward = function (dist)
			{
				if (dist !== 0)
				{
					this.x += Math.cos(this.angle) * dist;
					this.y += Math.sin(this.angle) * dist;
					this.set_bbox_changed();
				}
			};
			acts.MoveAtAngle = function (a, dist)
			{
				if (dist !== 0)
				{
					this.x += Math.cos(cr.to_radians(a)) * dist;
					this.y += Math.sin(cr.to_radians(a)) * dist;
					this.set_bbox_changed();
				}
			};
			exps.X = function (ret)
			{
				ret.set_float(this.x);
			};
			exps.Y = function (ret)
			{
				ret.set_float(this.y);
			};
			exps.dt = function (ret)
			{
				ret.set_float(this.runtime.getDt(this));
			};
		}
		if (size_aces)
		{
			cnds.CompareWidth = function (cmp, w)
			{
				return cr.do_cmp(this.width, cmp, w);
			};
			cnds.CompareHeight = function (cmp, h)
			{
				return cr.do_cmp(this.height, cmp, h);
			};
			acts.SetWidth = function (w)
			{
				if (this.width !== w)
				{
					this.width = w;
					this.set_bbox_changed();
				}
			};
			acts.SetHeight = function (h)
			{
				if (this.height !== h)
				{
					this.height = h;
					this.set_bbox_changed();
				}
			};
			acts.SetSize = function (w, h)
			{
				if (this.width !== w || this.height !== h)
				{
					this.width = w;
					this.height = h;
					this.set_bbox_changed();
				}
			};
			exps.Width = function (ret)
			{
				ret.set_float(this.width);
			};
			exps.Height = function (ret)
			{
				ret.set_float(this.height);
			};
			exps.BBoxLeft = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.left);
			};
			exps.BBoxTop = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.top);
			};
			exps.BBoxRight = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.right);
			};
			exps.BBoxBottom = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.bottom);
			};
		}
		if (angle_aces)
		{
			cnds.AngleWithin = function (within, a)
			{
				return cr.angleDiff(this.angle, cr.to_radians(a)) <= cr.to_radians(within);
			};
			cnds.IsClockwiseFrom = function (a)
			{
				return cr.angleClockwise(this.angle, cr.to_radians(a));
			};
			cnds.IsBetweenAngles = function (a, b)
			{
				var lower = cr.to_clamped_radians(a);
				var upper = cr.to_clamped_radians(b);
				var angle = cr.clamp_angle(this.angle);
				var obtuse = (!cr.angleClockwise(upper, lower));
				if (obtuse)
					return !(!cr.angleClockwise(angle, lower) && cr.angleClockwise(angle, upper));
				else
					return cr.angleClockwise(angle, lower) && !cr.angleClockwise(angle, upper);
			};
			acts.SetAngle = function (a)
			{
				var newangle = cr.to_radians(cr.clamp_angle_degrees(a));
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			acts.RotateClockwise = function (a)
			{
				if (a !== 0 && !isNaN(a))
				{
					this.angle += cr.to_radians(a);
					this.angle = cr.clamp_angle(this.angle);
					this.set_bbox_changed();
				}
			};
			acts.RotateCounterclockwise = function (a)
			{
				if (a !== 0 && !isNaN(a))
				{
					this.angle -= cr.to_radians(a);
					this.angle = cr.clamp_angle(this.angle);
					this.set_bbox_changed();
				}
			};
			acts.RotateTowardAngle = function (amt, target)
			{
				var newangle = cr.angleRotate(this.angle, cr.to_radians(target), cr.to_radians(amt));
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			acts.RotateTowardPosition = function (amt, x, y)
			{
				var dx = x - this.x;
				var dy = y - this.y;
				var target = Math.atan2(dy, dx);
				var newangle = cr.angleRotate(this.angle, target, cr.to_radians(amt));
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			acts.SetTowardPosition = function (x, y)
			{
				var dx = x - this.x;
				var dy = y - this.y;
				var newangle = Math.atan2(dy, dx);
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			exps.Angle = function (ret)
			{
				ret.set_float(cr.to_clamped_degrees(this.angle));
			};
		}
		if (!singleglobal_)
		{
			cnds.CompareInstanceVar = function (iv, cmp, val)
			{
				return cr.do_cmp(this.instance_vars[iv], cmp, val);
			};
			cnds.IsBoolInstanceVarSet = function (iv)
			{
				return this.instance_vars[iv];
			};
			cnds.PickInstVarHiLow = function (which, iv)
			{
				var sol = this.getCurrentSol();
				var instances = sol.getObjects();
				if (!instances.length)
					return false;
				var inst = instances[0];
				var pickme = inst;
				var val = inst.instance_vars[iv];
				var i, len, v;
				for (i = 1, len = instances.length; i < len; i++)
				{
					inst = instances[i];
					v = inst.instance_vars[iv];
					if ((which === 0 && v < val) || (which === 1 && v > val))
					{
						val = v;
						pickme = inst;
					}
				}
				sol.pick_one(pickme);
				return true;
			};
			cnds.PickByUID = function (u)
			{
				var i, len, j, inst, families, instances, sol;
				var cnd = this.runtime.getCurrentCondition();
				if (cnd.inverted)
				{
					sol = this.getCurrentSol();
					if (sol.select_all)
					{
						sol.select_all = false;
						cr.clearArray(sol.instances);
						cr.clearArray(sol.else_instances);
						instances = this.instances;
						for (i = 0, len = instances.length; i < len; i++)
						{
							inst = instances[i];
							if (inst.uid === u)
								sol.else_instances.push(inst);
							else
								sol.instances.push(inst);
						}
						this.applySolToContainer();
						return !!sol.instances.length;
					}
					else
					{
						for (i = 0, j = 0, len = sol.instances.length; i < len; i++)
						{
							inst = sol.instances[i];
							sol.instances[j] = inst;
							if (inst.uid === u)
							{
								sol.else_instances.push(inst);
							}
							else
								j++;
						}
						cr.truncateArray(sol.instances, j);
						this.applySolToContainer();
						return !!sol.instances.length;
					}
				}
				else
				{
					inst = this.runtime.getObjectByUID(u);
					if (!inst)
						return false;
					sol = this.getCurrentSol();
					if (!sol.select_all && sol.instances.indexOf(inst) === -1)
						return false;		// not picked
					if (this.is_family)
					{
						families = inst.type.families;
						for (i = 0, len = families.length; i < len; i++)
						{
							if (families[i] === this)
							{
								sol.pick_one(inst);
								this.applySolToContainer();
								return true;
							}
						}
					}
					else if (inst.type === this)
					{
						sol.pick_one(inst);
						this.applySolToContainer();
						return true;
					}
					return false;
				}
			};
			cnds.OnCreated = function ()
			{
				return true;
			};
			cnds.OnDestroyed = function ()
			{
				return true;
			};
			acts.SetInstanceVar = function (iv, val)
			{
				var myinstvars = this.instance_vars;
				if (cr.is_number(myinstvars[iv]))
				{
					if (cr.is_number(val))
						myinstvars[iv] = val;
					else
						myinstvars[iv] = parseFloat(val);
				}
				else if (cr.is_string(myinstvars[iv]))
				{
					if (cr.is_string(val))
						myinstvars[iv] = val;
					else
						myinstvars[iv] = val.toString();
				}
				else
;
			};
			acts.AddInstanceVar = function (iv, val)
			{
				var myinstvars = this.instance_vars;
				if (cr.is_number(myinstvars[iv]))
				{
					if (cr.is_number(val))
						myinstvars[iv] += val;
					else
						myinstvars[iv] += parseFloat(val);
				}
				else if (cr.is_string(myinstvars[iv]))
				{
					if (cr.is_string(val))
						myinstvars[iv] += val;
					else
						myinstvars[iv] += val.toString();
				}
				else
;
			};
			acts.SubInstanceVar = function (iv, val)
			{
				var myinstvars = this.instance_vars;
				if (cr.is_number(myinstvars[iv]))
				{
					if (cr.is_number(val))
						myinstvars[iv] -= val;
					else
						myinstvars[iv] -= parseFloat(val);
				}
				else
;
			};
			acts.SetBoolInstanceVar = function (iv, val)
			{
				this.instance_vars[iv] = val ? 1 : 0;
			};
			acts.ToggleBoolInstanceVar = function (iv)
			{
				this.instance_vars[iv] = 1 - this.instance_vars[iv];
			};
			acts.Destroy = function ()
			{
				this.runtime.DestroyInstance(this);
			};
			if (!acts.LoadFromJsonString)
			{
				acts.LoadFromJsonString = function (str_)
				{
					var o, i, len, binst;
					try {
						o = JSON.parse(str_);
					}
					catch (e) {
						return;
					}
					this.runtime.loadInstanceFromJSON(this, o, true);
					if (this.afterLoad)
						this.afterLoad();
					if (this.behavior_insts)
					{
						for (i = 0, len = this.behavior_insts.length; i < len; ++i)
						{
							binst = this.behavior_insts[i];
							if (binst.afterLoad)
								binst.afterLoad();
						}
					}
				};
			}
			exps.Count = function (ret)
			{
				var count = ret.object_class.instances.length;
				var i, len, inst;
				for (i = 0, len = this.runtime.createRow.length; i < len; i++)
				{
					inst = this.runtime.createRow[i];
					if (ret.object_class.is_family)
					{
						if (inst.type.families.indexOf(ret.object_class) >= 0)
							count++;
					}
					else
					{
						if (inst.type === ret.object_class)
							count++;
					}
				}
				ret.set_int(count);
			};
			exps.PickedCount = function (ret)
			{
				ret.set_int(ret.object_class.getCurrentSol().getObjects().length);
			};
			exps.UID = function (ret)
			{
				ret.set_int(this.uid);
			};
			exps.IID = function (ret)
			{
				ret.set_int(this.get_iid());
			};
			if (!exps.AsJSON)
			{
				exps.AsJSON = function (ret)
				{
					ret.set_string(JSON.stringify(this.runtime.saveInstanceToJSON(this, true)));
				};
			}
		}
		if (appearance_aces)
		{
			cnds.IsVisible = function ()
			{
				return this.visible;
			};
			acts.SetVisible = function (v)
			{
				if (!v !== !this.visible)
				{
					this.visible = !!v;
					this.runtime.redraw = true;
				}
			};
			cnds.CompareOpacity = function (cmp, x)
			{
				return cr.do_cmp(cr.round6dp(this.opacity * 100), cmp, x);
			};
			acts.SetOpacity = function (x)
			{
				var new_opacity = x / 100.0;
				if (new_opacity < 0)
					new_opacity = 0;
				else if (new_opacity > 1)
					new_opacity = 1;
				if (new_opacity !== this.opacity)
				{
					this.opacity = new_opacity;
					this.runtime.redraw = true;
				}
			};
			exps.Opacity = function (ret)
			{
				ret.set_float(cr.round6dp(this.opacity * 100.0));
			};
		}
		if (zorder_aces)
		{
			cnds.IsOnLayer = function (layer_)
			{
				if (!layer_)
					return false;
				return this.layer === layer_;
			};
			cnds.PickTopBottom = function (which_)
			{
				var sol = this.getCurrentSol();
				var instances = sol.getObjects();
				if (!instances.length)
					return false;
				var inst = instances[0];
				var pickme = inst;
				var i, len;
				for (i = 1, len = instances.length; i < len; i++)
				{
					inst = instances[i];
					if (which_ === 0)
					{
						if (inst.layer.index > pickme.layer.index || (inst.layer.index === pickme.layer.index && inst.get_zindex() > pickme.get_zindex()))
						{
							pickme = inst;
						}
					}
					else
					{
						if (inst.layer.index < pickme.layer.index || (inst.layer.index === pickme.layer.index && inst.get_zindex() < pickme.get_zindex()))
						{
							pickme = inst;
						}
					}
				}
				sol.pick_one(pickme);
				return true;
			};
			acts.MoveToTop = function ()
			{
				var layer = this.layer;
				var layer_instances = layer.instances;
				if (layer_instances.length && layer_instances[layer_instances.length - 1] === this)
					return;		// is already at top
				layer.removeFromInstanceList(this, false);
				layer.appendToInstanceList(this, false);
				this.runtime.redraw = true;
			};
			acts.MoveToBottom = function ()
			{
				var layer = this.layer;
				var layer_instances = layer.instances;
				if (layer_instances.length && layer_instances[0] === this)
					return;		// is already at bottom
				layer.removeFromInstanceList(this, false);
				layer.prependToInstanceList(this, false);
				this.runtime.redraw = true;
			};
			acts.MoveToLayer = function (layerMove)
			{
				if (!layerMove || layerMove == this.layer)
					return;
				this.layer.removeFromInstanceList(this, true);
				this.layer = layerMove;
				layerMove.appendToInstanceList(this, true);
				this.runtime.redraw = true;
			};
			acts.ZMoveToObject = function (where_, obj_)
			{
				var isafter = (where_ === 0);
				if (!obj_)
					return;
				var other = obj_.getFirstPicked(this);
				if (!other || other.uid === this.uid)
					return;
				if (this.layer.index !== other.layer.index)
				{
					this.layer.removeFromInstanceList(this, true);
					this.layer = other.layer;
					other.layer.appendToInstanceList(this, true);
				}
				this.layer.moveInstanceAdjacent(this, other, isafter);
				this.runtime.redraw = true;
			};
			exps.LayerNumber = function (ret)
			{
				ret.set_int(this.layer.number);
			};
			exps.LayerName = function (ret)
			{
				ret.set_string(this.layer.name);
			};
			exps.ZIndex = function (ret)
			{
				ret.set_int(this.get_zindex());
			};
		}
		if (effects_aces)
		{
			acts.SetEffectEnabled = function (enable_, effectname_)
			{
				if (!this.runtime.glwrap)
					return;
				var i = this.type.getEffectIndexByName(effectname_);
				if (i < 0)
					return;		// effect name not found
				var enable = (enable_ === 1);
				if (this.active_effect_flags[i] === enable)
					return;		// no change
				this.active_effect_flags[i] = enable;
				this.updateActiveEffects();
				this.runtime.redraw = true;
			};
			acts.SetEffectParam = function (effectname_, index_, value_)
			{
				if (!this.runtime.glwrap)
					return;
				var i = this.type.getEffectIndexByName(effectname_);
				if (i < 0)
					return;		// effect name not found
				var et = this.type.effect_types[i];
				var params = this.effect_params[i];
				index_ = Math.floor(index_);
				if (index_ < 0 || index_ >= params.length)
					return;		// effect index out of bounds
				if (this.runtime.glwrap.getProgramParameterType(et.shaderindex, index_) === 1)
					value_ /= 100.0;
				if (params[index_] === value_)
					return;		// no change
				params[index_] = value_;
				if (et.active)
					this.runtime.redraw = true;
			};
		}
	};
	cr.set_bbox_changed = function ()
	{
		this.bbox_changed = true;      		// will recreate next time box requested
		this.cell_changed = true;
		this.type.any_cell_changed = true;	// avoid unnecessary updateAllBBox() calls
		this.runtime.redraw = true;     	// assume runtime needs to redraw
		var i, len, callbacks = this.bbox_changed_callbacks;
		for (i = 0, len = callbacks.length; i < len; ++i)
		{
			callbacks[i](this);
		}
		if (this.layer.useRenderCells)
			this.update_bbox();
	};
	cr.add_bbox_changed_callback = function (f)
	{
		if (f)
		{
			this.bbox_changed_callbacks.push(f);
		}
	};
	cr.update_bbox = function ()
	{
		if (!this.bbox_changed)
			return;                 // bounding box not changed
		var bbox = this.bbox;
		var bquad = this.bquad;
		bbox.set(this.x, this.y, this.x + this.width, this.y + this.height);
		bbox.offset(-this.hotspotX * this.width, -this.hotspotY * this.height);
		if (!this.angle)
		{
			bquad.set_from_rect(bbox);    // make bounding quad from box
		}
		else
		{
			bbox.offset(-this.x, -this.y);       			// translate to origin
			bquad.set_from_rotated_rect(bbox, this.angle);	// rotate around origin
			bquad.offset(this.x, this.y);      				// translate back to original position
			bquad.bounding_box(bbox);
		}
		bbox.normalize();
		this.bbox_changed = false;  // bounding box up to date
		this.update_render_cell();
	};
	var tmprc = new cr.rect(0, 0, 0, 0);
	cr.update_render_cell = function ()
	{
		if (!this.layer.useRenderCells)
			return;
		var mygrid = this.layer.render_grid;
		var bbox = this.bbox;
		tmprc.set(mygrid.XToCell(bbox.left), mygrid.YToCell(bbox.top), mygrid.XToCell(bbox.right), mygrid.YToCell(bbox.bottom));
		if (this.rendercells.equals(tmprc))
			return;
		if (this.rendercells.right < this.rendercells.left)
			mygrid.update(this, null, tmprc);		// first insertion with invalid rect: don't provide old range
		else
			mygrid.update(this, this.rendercells, tmprc);
		this.rendercells.copy(tmprc);
		this.layer.render_list_stale = true;
	};
	cr.update_collision_cell = function ()
	{
		if (!this.cell_changed || !this.collisionsEnabled)
			return;
		this.update_bbox();
		var mygrid = this.type.collision_grid;
		var bbox = this.bbox;
		tmprc.set(mygrid.XToCell(bbox.left), mygrid.YToCell(bbox.top), mygrid.XToCell(bbox.right), mygrid.YToCell(bbox.bottom));
		if (this.collcells.equals(tmprc))
			return;
		if (this.collcells.right < this.collcells.left)
			mygrid.update(this, null, tmprc);		// first insertion with invalid rect: don't provide old range
		else
			mygrid.update(this, this.collcells, tmprc);
		this.collcells.copy(tmprc);
		this.cell_changed = false;
	};
	cr.inst_contains_pt = function (x, y)
	{
		if (!this.bbox.contains_pt(x, y))
			return false;
		if (!this.bquad.contains_pt(x, y))
			return false;
		if (this.tilemap_exists)
			return this.testPointOverlapTile(x, y);
		if (this.collision_poly && !this.collision_poly.is_empty())
		{
			this.collision_poly.cache_poly(this.width, this.height, this.angle);
			return this.collision_poly.contains_pt(x - this.x, y - this.y);
		}
		else
			return true;
	};
	cr.inst_get_iid = function ()
	{
		this.type.updateIIDs();
		return this.iid;
	};
	cr.inst_get_zindex = function ()
	{
		this.layer.updateZIndices();
		return this.zindex;
	};
	cr.inst_updateActiveEffects = function ()
	{
		cr.clearArray(this.active_effect_types);
		var i, len, et;
		var preserves_opaqueness = true;
		for (i = 0, len = this.active_effect_flags.length; i < len; i++)
		{
			if (this.active_effect_flags[i])
			{
				et = this.type.effect_types[i];
				this.active_effect_types.push(et);
				if (!et.preservesOpaqueness)
					preserves_opaqueness = false;
			}
		}
		this.uses_shaders = !!this.active_effect_types.length;
		this.shaders_preserve_opaqueness = preserves_opaqueness;
	};
	cr.inst_toString = function ()
	{
		return "Inst" + this.puid;
	};
	cr.type_getFirstPicked = function (frominst)
	{
		if (frominst && frominst.is_contained && frominst.type != this)
		{
			var i, len, s;
			for (i = 0, len = frominst.siblings.length; i < len; i++)
			{
				s = frominst.siblings[i];
				if (s.type == this)
					return s;
			}
		}
		var instances = this.getCurrentSol().getObjects();
		if (instances.length)
			return instances[0];
		else
			return null;
	};
	cr.type_getPairedInstance = function (inst)
	{
		var instances = this.getCurrentSol().getObjects();
		if (instances.length)
			return instances[inst.get_iid() % instances.length];
		else
			return null;
	};
	cr.type_updateIIDs = function ()
	{
		if (!this.stale_iids || this.is_family)
			return;		// up to date or is family - don't want family to overwrite IIDs
		var i, len;
		for (i = 0, len = this.instances.length; i < len; i++)
			this.instances[i].iid = i;
		var next_iid = i;
		var createRow = this.runtime.createRow;
		for (i = 0, len = createRow.length; i < len; ++i)
		{
			if (createRow[i].type === this)
				createRow[i].iid = next_iid++;
		}
		this.stale_iids = false;
	};
	cr.type_getInstanceByIID = function (i)
	{
		if (i < this.instances.length)
			return this.instances[i];
		i -= this.instances.length;
		var createRow = this.runtime.createRow;
		var j, lenj;
		for (j = 0, lenj = createRow.length; j < lenj; ++j)
		{
			if (createRow[j].type === this)
			{
				if (i === 0)
					return createRow[j];
				--i;
			}
		}
;
		return null;
	};
	cr.type_getCurrentSol = function ()
	{
		return this.solstack[this.cur_sol];
	};
	cr.type_pushCleanSol = function ()
	{
		this.cur_sol++;
		if (this.cur_sol === this.solstack.length)
		{
			this.solstack.push(new cr.selection(this));
		}
		else
		{
			this.solstack[this.cur_sol].select_all = true;  // else clear next SOL
			cr.clearArray(this.solstack[this.cur_sol].else_instances);
		}
	};
	cr.type_pushCopySol = function ()
	{
		this.cur_sol++;
		if (this.cur_sol === this.solstack.length)
			this.solstack.push(new cr.selection(this));
		var clonesol = this.solstack[this.cur_sol];
		var prevsol = this.solstack[this.cur_sol - 1];
		if (prevsol.select_all)
		{
			clonesol.select_all = true;
		}
		else
		{
			clonesol.select_all = false;
			cr.shallowAssignArray(clonesol.instances, prevsol.instances);
		}
		cr.clearArray(clonesol.else_instances);
	};
	cr.type_popSol = function ()
	{
;
		this.cur_sol--;
	};
	cr.type_getBehaviorByName = function (behname)
	{
		var i, len, j, lenj, f, index = 0;
		if (!this.is_family)
		{
			for (i = 0, len = this.families.length; i < len; i++)
			{
				f = this.families[i];
				for (j = 0, lenj = f.behaviors.length; j < lenj; j++)
				{
					if (behname === f.behaviors[j].name)
					{
						this.extra["lastBehIndex"] = index;
						return f.behaviors[j];
					}
					index++;
				}
			}
		}
		for (i = 0, len = this.behaviors.length; i < len; i++) {
			if (behname === this.behaviors[i].name)
			{
				this.extra["lastBehIndex"] = index;
				return this.behaviors[i];
			}
			index++;
		}
		return null;
	};
	cr.type_getBehaviorIndexByName = function (behname)
	{
		var b = this.getBehaviorByName(behname);
		if (b)
			return this.extra["lastBehIndex"];
		else
			return -1;
	};
	cr.type_getEffectIndexByName = function (name_)
	{
		var i, len;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			if (this.effect_types[i].name === name_)
				return i;
		}
		return -1;
	};
	cr.type_applySolToContainer = function ()
	{
		if (!this.is_contained || this.is_family)
			return;
		var i, len, j, lenj, t, sol, sol2;
		this.updateIIDs();
		sol = this.getCurrentSol();
		var select_all = sol.select_all;
		var es = this.runtime.getCurrentEventStack();
		var orblock = es && es.current_event && es.current_event.orblock;
		for (i = 0, len = this.container.length; i < len; i++)
		{
			t = this.container[i];
			if (t === this)
				continue;
			t.updateIIDs();
			sol2 = t.getCurrentSol();
			sol2.select_all = select_all;
			if (!select_all)
			{
				cr.clearArray(sol2.instances);
				for (j = 0, lenj = sol.instances.length; j < lenj; ++j)
					sol2.instances[j] = t.getInstanceByIID(sol.instances[j].iid);
				if (orblock)
				{
					cr.clearArray(sol2.else_instances);
					for (j = 0, lenj = sol.else_instances.length; j < lenj; ++j)
						sol2.else_instances[j] = t.getInstanceByIID(sol.else_instances[j].iid);
				}
			}
		}
	};
	cr.type_toString = function ()
	{
		return "Type" + this.sid;
	};
	cr.do_cmp = function (x, cmp, y)
	{
		if (typeof x === "undefined" || typeof y === "undefined")
			return false;
		switch (cmp)
		{
			case 0:     // equal
				return x === y;
			case 1:     // not equal
				return x !== y;
			case 2:     // less
				return x < y;
			case 3:     // less/equal
				return x <= y;
			case 4:     // greater
				return x > y;
			case 5:     // greater/equal
				return x >= y;
			default:
;
				return false;
		}
	};
})();
cr.shaders = {};
;
;
cr.plugins_.Keyboard = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Keyboard.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.keyMap = new Array(256);	// stores key up/down state
		this.usedKeys = new Array(256);
		this.triggerKey = 0;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		var self = this;
		if (!this.runtime.isDomFree)
		{
			jQuery(document).keydown(
				function(info) {
					self.onKeyDown(info);
				}
			);
			jQuery(document).keyup(
				function(info) {
					self.onKeyUp(info);
				}
			);
		}
	};
	var keysToBlockWhenFramed = [32, 33, 34, 35, 36, 37, 38, 39, 40, 44];
	instanceProto.onKeyDown = function (info)
	{
		var alreadyPreventedDefault = false;
		if (window != window.top && keysToBlockWhenFramed.indexOf(info.which) > -1)
		{
			info.preventDefault();
			alreadyPreventedDefault = true;
			info.stopPropagation();
		}
		if (this.keyMap[info.which])
		{
			if (this.usedKeys[info.which] && !alreadyPreventedDefault)
				info.preventDefault();
			return;
		}
		this.keyMap[info.which] = true;
		this.triggerKey = info.which;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnAnyKey, this);
		var eventRan = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKey, this);
		var eventRan2 = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyCode, this);
		this.runtime.isInUserInputEvent = false;
		if (eventRan || eventRan2)
		{
			this.usedKeys[info.which] = true;
			if (!alreadyPreventedDefault)
				info.preventDefault();
		}
	};
	instanceProto.onKeyUp = function (info)
	{
		this.keyMap[info.which] = false;
		this.triggerKey = info.which;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnAnyKeyReleased, this);
		var eventRan = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyReleased, this);
		var eventRan2 = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyCodeReleased, this);
		this.runtime.isInUserInputEvent = false;
		if (eventRan || eventRan2 || this.usedKeys[info.which])
		{
			this.usedKeys[info.which] = true;
			info.preventDefault();
		}
	};
	instanceProto.onWindowBlur = function ()
	{
		var i;
		for (i = 0; i < 256; ++i)
		{
			if (!this.keyMap[i])
				continue;		// key already up
			this.keyMap[i] = false;
			this.triggerKey = i;
			this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnAnyKeyReleased, this);
			var eventRan = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyReleased, this);
			var eventRan2 = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyCodeReleased, this);
			if (eventRan || eventRan2)
				this.usedKeys[i] = true;
		}
	};
	instanceProto.saveToJSON = function ()
	{
		return { "triggerKey": this.triggerKey };
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.triggerKey = o["triggerKey"];
	};
	function Cnds() {};
	Cnds.prototype.IsKeyDown = function(key)
	{
		return this.keyMap[key];
	};
	Cnds.prototype.OnKey = function(key)
	{
		return (key === this.triggerKey);
	};
	Cnds.prototype.OnAnyKey = function(key)
	{
		return true;
	};
	Cnds.prototype.OnAnyKeyReleased = function(key)
	{
		return true;
	};
	Cnds.prototype.OnKeyReleased = function(key)
	{
		return (key === this.triggerKey);
	};
	Cnds.prototype.IsKeyCodeDown = function(key)
	{
		key = Math.floor(key);
		if (key < 0 || key >= this.keyMap.length)
			return false;
		return this.keyMap[key];
	};
	Cnds.prototype.OnKeyCode = function(key)
	{
		return (key === this.triggerKey);
	};
	Cnds.prototype.OnKeyCodeReleased = function(key)
	{
		return (key === this.triggerKey);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.LastKeyCode = function (ret)
	{
		ret.set_int(this.triggerKey);
	};
	function fixedStringFromCharCode(kc)
	{
		kc = Math.floor(kc);
		switch (kc) {
		case 8:		return "backspace";
		case 9:		return "tab";
		case 13:	return "enter";
		case 16:	return "shift";
		case 17:	return "control";
		case 18:	return "alt";
		case 19:	return "pause";
		case 20:	return "capslock";
		case 27:	return "esc";
		case 33:	return "pageup";
		case 34:	return "pagedown";
		case 35:	return "end";
		case 36:	return "home";
		case 37:	return "←";
		case 38:	return "↑";
		case 39:	return "→";
		case 40:	return "↓";
		case 45:	return "insert";
		case 46:	return "del";
		case 91:	return "left window key";
		case 92:	return "right window key";
		case 93:	return "select";
		case 96:	return "numpad 0";
		case 97:	return "numpad 1";
		case 98:	return "numpad 2";
		case 99:	return "numpad 3";
		case 100:	return "numpad 4";
		case 101:	return "numpad 5";
		case 102:	return "numpad 6";
		case 103:	return "numpad 7";
		case 104:	return "numpad 8";
		case 105:	return "numpad 9";
		case 106:	return "numpad *";
		case 107:	return "numpad +";
		case 109:	return "numpad -";
		case 110:	return "numpad .";
		case 111:	return "numpad /";
		case 112:	return "F1";
		case 113:	return "F2";
		case 114:	return "F3";
		case 115:	return "F4";
		case 116:	return "F5";
		case 117:	return "F6";
		case 118:	return "F7";
		case 119:	return "F8";
		case 120:	return "F9";
		case 121:	return "F10";
		case 122:	return "F11";
		case 123:	return "F12";
		case 144:	return "numlock";
		case 145:	return "scroll lock";
		case 186:	return ";";
		case 187:	return "=";
		case 188:	return ",";
		case 189:	return "-";
		case 190:	return ".";
		case 191:	return "/";
		case 192:	return "'";
		case 219:	return "[";
		case 220:	return "\\";
		case 221:	return "]";
		case 222:	return "#";
		case 223:	return "`";
		default:	return String.fromCharCode(kc);
		}
	};
	Exps.prototype.StringFromKeyCode = function (ret, kc)
	{
		ret.set_string(fixedStringFromCharCode(kc));
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Mouse = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Mouse.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.buttonMap = new Array(4);		// mouse down states
		this.mouseXcanvas = 0;				// mouse position relative to canvas
		this.mouseYcanvas = 0;
		this.triggerButton = 0;
		this.triggerType = 0;
		this.triggerDir = 0;
		this.handled = false;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		var self = this;
		if (!this.runtime.isDomFree)
		{
			jQuery(document).mousemove(
				function(info) {
					self.onMouseMove(info);
				}
			);
			jQuery(document).mousedown(
				function(info) {
					self.onMouseDown(info);
				}
			);
			jQuery(document).mouseup(
				function(info) {
					self.onMouseUp(info);
				}
			);
			jQuery(document).dblclick(
				function(info) {
					self.onDoubleClick(info);
				}
			);
			var wheelevent = function(info) {
								self.onWheel(info);
							};
			document.addEventListener("mousewheel", wheelevent, false);
			document.addEventListener("DOMMouseScroll", wheelevent, false);
		}
	};
	var dummyoffset = {left: 0, top: 0};
	instanceProto.onMouseMove = function(info)
	{
		var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
		this.mouseXcanvas = info.pageX - offset.left;
		this.mouseYcanvas = info.pageY - offset.top;
	};
	instanceProto.mouseInGame = function ()
	{
		if (this.runtime.fullscreen_mode > 0)
			return true;
		return this.mouseXcanvas >= 0 && this.mouseYcanvas >= 0
		    && this.mouseXcanvas < this.runtime.width && this.mouseYcanvas < this.runtime.height;
	};
	instanceProto.onMouseDown = function(info)
	{
		if (!this.mouseInGame())
			return;
		this.buttonMap[info.which] = true;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnAnyClick, this);
		this.triggerButton = info.which - 1;	// 1-based
		this.triggerType = 0;					// single click
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnClick, this);
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnObjectClicked, this);
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onMouseUp = function(info)
	{
		if (!this.buttonMap[info.which])
			return;
		if (this.runtime.had_a_click && !this.runtime.isMobile)
			info.preventDefault();
		this.runtime.had_a_click = true;
		this.buttonMap[info.which] = false;
		this.runtime.isInUserInputEvent = true;
		this.triggerButton = info.which - 1;	// 1-based
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnRelease, this);
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onDoubleClick = function(info)
	{
		if (!this.mouseInGame())
			return;
		info.preventDefault();
		this.runtime.isInUserInputEvent = true;
		this.triggerButton = info.which - 1;	// 1-based
		this.triggerType = 1;					// double click
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnClick, this);
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnObjectClicked, this);
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onWheel = function (info)
	{
		var delta = info.wheelDelta ? info.wheelDelta : info.detail ? -info.detail : 0;
		this.triggerDir = (delta < 0 ? 0 : 1);
		this.handled = false;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnWheel, this);
		this.runtime.isInUserInputEvent = false;
		if (this.handled && cr.isCanvasInputEvent(info))
			info.preventDefault();
	};
	instanceProto.onWindowBlur = function ()
	{
		var i, len;
		for (i = 0, len = this.buttonMap.length; i < len; ++i)
		{
			if (!this.buttonMap[i])
				continue;
			this.buttonMap[i] = false;
			this.triggerButton = i - 1;
			this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnRelease, this);
		}
	};
	function Cnds() {};
	Cnds.prototype.OnClick = function (button, type)
	{
		return button === this.triggerButton && type === this.triggerType;
	};
	Cnds.prototype.OnAnyClick = function ()
	{
		return true;
	};
	Cnds.prototype.IsButtonDown = function (button)
	{
		return this.buttonMap[button + 1];	// jQuery uses 1-based buttons for some reason
	};
	Cnds.prototype.OnRelease = function (button)
	{
		return button === this.triggerButton;
	};
	Cnds.prototype.IsOverObject = function (obj)
	{
		var cnd = this.runtime.getCurrentCondition();
		var mx = this.mouseXcanvas;
		var my = this.mouseYcanvas;
		return cr.xor(this.runtime.testAndSelectCanvasPointOverlap(obj, mx, my, cnd.inverted), cnd.inverted);
	};
	Cnds.prototype.OnObjectClicked = function (button, type, obj)
	{
		if (button !== this.triggerButton || type !== this.triggerType)
			return false;	// wrong click type
		return this.runtime.testAndSelectCanvasPointOverlap(obj, this.mouseXcanvas, this.mouseYcanvas, false);
	};
	Cnds.prototype.OnWheel = function (dir)
	{
		this.handled = true;
		return dir === this.triggerDir;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	var lastSetCursor = null;
	Acts.prototype.SetCursor = function (c)
	{
		if (this.runtime.isDomFree)
			return;
		var cursor_style = ["auto", "pointer", "text", "crosshair", "move", "help", "wait", "none"][c];
		if (lastSetCursor === cursor_style)
			return;		// redundant
		lastSetCursor = cursor_style;
		document.body.style.cursor = cursor_style;
	};
	Acts.prototype.SetCursorSprite = function (obj)
	{
		if (this.runtime.isDomFree || this.runtime.isMobile || !obj)
			return;
		var inst = obj.getFirstPicked();
		if (!inst || !inst.curFrame)
			return;
		var frame = inst.curFrame;
		if (lastSetCursor === frame)
			return;		// already set this frame
		lastSetCursor = frame;
		var datauri = frame.getDataUri();
		var cursor_style = "url(" + datauri + ") " + Math.round(frame.hotspotX * frame.width) + " " + Math.round(frame.hotspotY * frame.height) + ", auto";
		document.body.style.cursor = "";
		document.body.style.cursor = cursor_style;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.X = function (ret, layerparam)
	{
		var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxX = layer.parallaxX;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxX = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.mouseXcanvas, this.mouseYcanvas, true));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxX = oldParallaxX;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.mouseXcanvas, this.mouseYcanvas, true));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.Y = function (ret, layerparam)
	{
		var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxY = layer.parallaxY;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxY = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.mouseXcanvas, this.mouseYcanvas, false));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxY = oldParallaxY;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.mouseXcanvas, this.mouseYcanvas, false));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.AbsoluteX = function (ret)
	{
		ret.set_float(this.mouseXcanvas);
	};
	Exps.prototype.AbsoluteY = function (ret)
	{
		ret.set_float(this.mouseYcanvas);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Particles = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Particles.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
		if (this.is_family)
			return;
		this.texture_img = new Image();
		this.texture_img.cr_filesize = this.texture_filesize;
		this.webGL_texture = null;
		this.runtime.waitForImageLoad(this.texture_img, this.texture_file);
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		this.webGL_texture = null;
	};
	typeProto.onRestoreWebGLContext = function ()
	{
		if (this.is_family || !this.instances.length)
			return;
		if (!this.webGL_texture)
		{
			this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
		}
	};
	typeProto.loadTextures = function ()
	{
		if (this.is_family || this.webGL_texture || !this.runtime.glwrap)
			return;
		this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
	};
	typeProto.unloadTextures = function ()
	{
		if (this.is_family || this.instances.length || !this.webGL_texture)
			return;
		this.runtime.glwrap.deleteTexture(this.webGL_texture);
		this.webGL_texture = null;
	};
	typeProto.preloadCanvas2D = function (ctx)
	{
		ctx.drawImage(this.texture_img, 0, 0);
	};
	function Particle(owner)
	{
		this.owner = owner;
		this.active = false;
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.angle = 0;
		this.opacity = 1;
		this.grow = 0;
		this.size = 0;
		this.gs = 0;			// gravity speed
		this.age = 0;
		cr.seal(this);
	};
	Particle.prototype.init = function ()
	{
		var owner = this.owner;
		this.x = owner.x - (owner.xrandom / 2) + (Math.random() * owner.xrandom);
		this.y = owner.y - (owner.yrandom / 2) + (Math.random() * owner.yrandom);
		this.speed = owner.initspeed - (owner.speedrandom / 2) + (Math.random() * owner.speedrandom);
		this.angle = owner.angle - (owner.spraycone / 2) + (Math.random() * owner.spraycone);
		this.opacity = owner.initopacity;
		this.size = owner.initsize - (owner.sizerandom / 2) + (Math.random() * owner.sizerandom);
		this.grow = owner.growrate - (owner.growrandom / 2) + (Math.random() * owner.growrandom);
		this.gs = 0;
		this.age = 0;
	};
	Particle.prototype.tick = function (dt)
	{
		var owner = this.owner;
		this.x += Math.cos(this.angle) * this.speed * dt;
		this.y += Math.sin(this.angle) * this.speed * dt;
		this.y += this.gs * dt;
		this.speed += owner.acc * dt;
		this.size += this.grow * dt;
		this.gs += owner.g * dt;
		this.age += dt;
		if (this.size < 1)
		{
			this.active = false;
			return;
		}
		if (owner.lifeanglerandom !== 0)
			this.angle += (Math.random() * owner.lifeanglerandom * dt) - (owner.lifeanglerandom * dt / 2);
		if (owner.lifespeedrandom !== 0)
			this.speed += (Math.random() * owner.lifespeedrandom * dt) - (owner.lifespeedrandom * dt / 2);
		if (owner.lifeopacityrandom !== 0)
		{
			this.opacity += (Math.random() * owner.lifeopacityrandom * dt) - (owner.lifeopacityrandom * dt / 2);
			if (this.opacity < 0)
				this.opacity = 0;
			else if (this.opacity > 1)
				this.opacity = 1;
		}
		if (owner.destroymode <= 1 && this.age >= owner.timeout)
		{
			this.active = false;
		}
		if (owner.destroymode === 2 && this.speed <= 0)
		{
			this.active = false;
		}
	};
	Particle.prototype.draw = function (ctx)
	{
		var curopacity = this.owner.opacity * this.opacity;
		if (curopacity === 0)
			return;
		if (this.owner.destroymode === 0)
			curopacity *= 1 - (this.age / this.owner.timeout);
		ctx.globalAlpha = curopacity;
		var drawx = this.x - this.size / 2;
		var drawy = this.y - this.size / 2;
		if (this.owner.runtime.pixel_rounding)
		{
			drawx = (drawx + 0.5) | 0;
			drawy = (drawy + 0.5) | 0;
		}
		ctx.drawImage(this.owner.type.texture_img, drawx, drawy, this.size, this.size);
	};
	Particle.prototype.drawGL = function (glw)
	{
		var curopacity = this.owner.opacity * this.opacity;
		if (this.owner.destroymode === 0)
			curopacity *= 1 - (this.age / this.owner.timeout);
		var drawsize = this.size;
		var scaleddrawsize = drawsize * this.owner.particlescale;
		var drawx = this.x - drawsize / 2;
		var drawy = this.y - drawsize / 2;
		if (this.owner.runtime.pixel_rounding)
		{
			drawx = (drawx + 0.5) | 0;
			drawy = (drawy + 0.5) | 0;
		}
		if (scaleddrawsize < 1 || curopacity === 0)
			return;
		if (scaleddrawsize < glw.minPointSize || scaleddrawsize > glw.maxPointSize)
		{
			glw.setOpacity(curopacity);
			glw.quad(drawx, drawy, drawx + drawsize, drawy, drawx + drawsize, drawy + drawsize, drawx, drawy + drawsize);
		}
		else
			glw.point(this.x, this.y, scaleddrawsize, curopacity);
	};
	Particle.prototype.left = function ()
	{
		return this.x - this.size / 2;
	};
	Particle.prototype.right = function ()
	{
		return this.x + this.size / 2;
	};
	Particle.prototype.top = function ()
	{
		return this.y - this.size / 2;
	};
	Particle.prototype.bottom = function ()
	{
		return this.y + this.size / 2;
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var deadparticles = [];
	instanceProto.onCreate = function()
	{
		var props = this.properties;
		this.rate = props[0];
		this.spraycone = cr.to_radians(props[1]);
		this.spraytype = props[2];			// 0 = continuous, 1 = one-shot
		this.spraying = true;				// for continuous mode only
		this.initspeed = props[3];
		this.initsize = props[4];
		this.initopacity = props[5] / 100.0;
		this.growrate = props[6];
		this.xrandom = props[7];
		this.yrandom = props[8];
		this.speedrandom = props[9];
		this.sizerandom = props[10];
		this.growrandom = props[11];
		this.acc = props[12];
		this.g = props[13];
		this.lifeanglerandom = props[14];
		this.lifespeedrandom = props[15];
		this.lifeopacityrandom = props[16];
		this.destroymode = props[17];		// 0 = fade, 1 = timeout, 2 = stopped
		this.timeout = props[18];
		this.particleCreateCounter = 0;
		this.particlescale = 1;
		this.particleBoxLeft = this.x;
		this.particleBoxTop = this.y;
		this.particleBoxRight = this.x;
		this.particleBoxBottom = this.y;
		this.add_bbox_changed_callback(function (self) {
			self.bbox.set(self.particleBoxLeft, self.particleBoxTop, self.particleBoxRight, self.particleBoxBottom);
			self.bquad.set_from_rect(self.bbox);
			self.bbox_changed = false;
			self.update_collision_cell();
			self.update_render_cell();
		});
		if (!this.recycled)
			this.particles = [];
		this.runtime.tickMe(this);
		this.type.loadTextures();
		if (this.spraytype === 1)
		{
			for (var i = 0; i < this.rate; i++)
				this.allocateParticle().opacity = 0;
		}
		this.first_tick = true;		// for re-init'ing one-shot particles on first tick so they assume any new angle/position
	};
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"r": this.rate,
			"sc": this.spraycone,
			"st": this.spraytype,
			"s": this.spraying,
			"isp": this.initspeed,
			"isz": this.initsize,
			"io": this.initopacity,
			"gr": this.growrate,
			"xr": this.xrandom,
			"yr": this.yrandom,
			"spr": this.speedrandom,
			"szr": this.sizerandom,
			"grnd": this.growrandom,
			"acc": this.acc,
			"g": this.g,
			"lar": this.lifeanglerandom,
			"lsr": this.lifespeedrandom,
			"lor": this.lifeopacityrandom,
			"dm": this.destroymode,
			"to": this.timeout,
			"pcc": this.particleCreateCounter,
			"ft": this.first_tick,
			"p": []
		};
		var i, len, p;
		var arr = o["p"];
		for (i = 0, len = this.particles.length; i < len; i++)
		{
			p = this.particles[i];
			arr.push([p.x, p.y, p.speed, p.angle, p.opacity, p.grow, p.size, p.gs, p.age]);
		}
		return o;
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.rate = o["r"];
		this.spraycone = o["sc"];
		this.spraytype = o["st"];
		this.spraying = o["s"];
		this.initspeed = o["isp"];
		this.initsize = o["isz"];
		this.initopacity = o["io"];
		this.growrate = o["gr"];
		this.xrandom = o["xr"];
		this.yrandom = o["yr"];
		this.speedrandom = o["spr"];
		this.sizerandom = o["szr"];
		this.growrandom = o["grnd"];
		this.acc = o["acc"];
		this.g = o["g"];
		this.lifeanglerandom = o["lar"];
		this.lifespeedrandom = o["lsr"];
		this.lifeopacityrandom = o["lor"];
		this.destroymode = o["dm"];
		this.timeout = o["to"];
		this.particleCreateCounter = o["pcc"];
		this.first_tick = o["ft"];
		deadparticles.push.apply(deadparticles, this.particles);
		cr.clearArray(this.particles);
		var i, len, p, d;
		var arr = o["p"];
		for (i = 0, len = arr.length; i < len; i++)
		{
			p = this.allocateParticle();
			d = arr[i];
			p.x = d[0];
			p.y = d[1];
			p.speed = d[2];
			p.angle = d[3];
			p.opacity = d[4];
			p.grow = d[5];
			p.size = d[6];
			p.gs = d[7];
			p.age = d[8];
		}
	};
	instanceProto.onDestroy = function ()
	{
		deadparticles.push.apply(deadparticles, this.particles);
		cr.clearArray(this.particles);
	};
	instanceProto.allocateParticle = function ()
	{
		var p;
		if (deadparticles.length)
		{
			p = deadparticles.pop();
			p.owner = this;
		}
		else
			p = new Particle(this);
		this.particles.push(p);
		p.active = true;
		return p;
	};
	instanceProto.tick = function()
	{
		var dt = this.runtime.getDt(this);
		var i, len, p, n, j;
		if (this.spraytype === 0 && this.spraying)
		{
			this.particleCreateCounter += dt * this.rate;
			n = cr.floor(this.particleCreateCounter);
			this.particleCreateCounter -= n;
			for (i = 0; i < n; i++)
			{
				p = this.allocateParticle();
				p.init();
			}
		}
		this.particleBoxLeft = this.x;
		this.particleBoxTop = this.y;
		this.particleBoxRight = this.x;
		this.particleBoxBottom = this.y;
		for (i = 0, j = 0, len = this.particles.length; i < len; i++)
		{
			p = this.particles[i];
			this.particles[j] = p;
			this.runtime.redraw = true;
			if (this.spraytype === 1 && this.first_tick)
				p.init();
			p.tick(dt);
			if (!p.active)
			{
				deadparticles.push(p);
				continue;
			}
			if (p.left() < this.particleBoxLeft)
				this.particleBoxLeft = p.left();
			if (p.right() > this.particleBoxRight)
				this.particleBoxRight = p.right();
			if (p.top() < this.particleBoxTop)
				this.particleBoxTop = p.top();
			if (p.bottom() > this.particleBoxBottom)
				this.particleBoxBottom = p.bottom();
			j++;
		}
		cr.truncateArray(this.particles, j);
		this.set_bbox_changed();
		this.first_tick = false;
		if (this.spraytype === 1 && this.particles.length === 0)
			this.runtime.DestroyInstance(this);
	};
	instanceProto.draw = function (ctx)
	{
		var i, len, p, layer = this.layer;
		for (i = 0, len = this.particles.length; i < len; i++)
		{
			p = this.particles[i];
			if (p.right() >= layer.viewLeft && p.bottom() >= layer.viewTop && p.left() <= layer.viewRight && p.top() <= layer.viewBottom)
			{
				p.draw(ctx);
			}
		}
	};
	instanceProto.drawGL = function (glw)
	{
		this.particlescale = this.layer.getScale();
		glw.setTexture(this.type.webGL_texture);
		var i, len, p, layer = this.layer;
		for (i = 0, len = this.particles.length; i < len; i++)
		{
			p = this.particles[i];
			if (p.right() >= layer.viewLeft && p.bottom() >= layer.viewTop && p.left() <= layer.viewRight && p.top() <= layer.viewBottom)
			{
				p.drawGL(glw);
			}
		}
	};
	function Cnds() {};
	Cnds.prototype.IsSpraying = function ()
	{
		return this.spraying;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetSpraying = function (set_)
	{
		this.spraying = (set_ !== 0);
	};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	Acts.prototype.SetRate = function (x)
	{
		this.rate = x;
		var diff, i;
		if (this.spraytype === 1 && this.first_tick)
		{
			if (x < this.particles.length)
			{
				diff = this.particles.length - x;
				for (i = 0; i < diff; i++)
					deadparticles.push(this.particles.pop());
			}
			else if (x > this.particles.length)
			{
				diff = x - this.particles.length;
				for (i = 0; i < diff; i++)
					this.allocateParticle().opacity = 0;
			}
		}
	};
	Acts.prototype.SetSprayCone = function (x)
	{
		this.spraycone = cr.to_radians(x);
	};
	Acts.prototype.SetInitSpeed = function (x)
	{
		this.initspeed = x;
	};
	Acts.prototype.SetInitSize = function (x)
	{
		this.initsize = x;
	};
	Acts.prototype.SetInitOpacity = function (x)
	{
		this.initopacity = x / 100;
	};
	Acts.prototype.SetGrowRate = function (x)
	{
		this.growrate = x;
	};
	Acts.prototype.SetXRandomiser = function (x)
	{
		this.xrandom = x;
	};
	Acts.prototype.SetYRandomiser = function (x)
	{
		this.yrandom = x;
	};
	Acts.prototype.SetSpeedRandomiser = function (x)
	{
		this.speedrandom = x;
	};
	Acts.prototype.SetSizeRandomiser = function (x)
	{
		this.sizerandom = x;
	};
	Acts.prototype.SetGrowRateRandomiser = function (x)
	{
		this.growrandom = x;
	};
	Acts.prototype.SetParticleAcc = function (x)
	{
		this.acc = x;
	};
	Acts.prototype.SetGravity = function (x)
	{
		this.g = x;
	};
	Acts.prototype.SetAngleRandomiser = function (x)
	{
		this.lifeanglerandom = x;
	};
	Acts.prototype.SetLifeSpeedRandomiser = function (x)
	{
		this.lifespeedrandom = x;
	};
	Acts.prototype.SetOpacityRandomiser = function (x)
	{
		this.lifeopacityrandom = x;
	};
	Acts.prototype.SetTimeout = function (x)
	{
		this.timeout = x;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.ParticleCount = function (ret)
	{
		ret.set_int(this.particles.length);
	};
	Exps.prototype.Rate = function (ret)
	{
		ret.set_float(this.rate);
	};
	Exps.prototype.SprayCone = function (ret)
	{
		ret.set_float(cr.to_degrees(this.spraycone));
	};
	Exps.prototype.InitSpeed = function (ret)
	{
		ret.set_float(this.initspeed);
	};
	Exps.prototype.InitSize = function (ret)
	{
		ret.set_float(this.initsize);
	};
	Exps.prototype.InitOpacity = function (ret)
	{
		ret.set_float(this.initopacity * 100);
	};
	Exps.prototype.InitGrowRate = function (ret)
	{
		ret.set_float(this.growrate);
	};
	Exps.prototype.XRandom = function (ret)
	{
		ret.set_float(this.xrandom);
	};
	Exps.prototype.YRandom = function (ret)
	{
		ret.set_float(this.yrandom);
	};
	Exps.prototype.InitSpeedRandom = function (ret)
	{
		ret.set_float(this.speedrandom);
	};
	Exps.prototype.InitSizeRandom = function (ret)
	{
		ret.set_float(this.sizerandom);
	};
	Exps.prototype.InitGrowRandom = function (ret)
	{
		ret.set_float(this.growrandom);
	};
	Exps.prototype.ParticleAcceleration = function (ret)
	{
		ret.set_float(this.acc);
	};
	Exps.prototype.Gravity = function (ret)
	{
		ret.set_float(this.g);
	};
	Exps.prototype.ParticleAngleRandom = function (ret)
	{
		ret.set_float(this.lifeanglerandom);
	};
	Exps.prototype.ParticleSpeedRandom = function (ret)
	{
		ret.set_float(this.lifespeedrandom);
	};
	Exps.prototype.ParticleOpacityRandom = function (ret)
	{
		ret.set_float(this.lifeopacityrandom);
	};
	Exps.prototype.Timeout = function (ret)
	{
		ret.set_float(this.timeout);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Sprite = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Sprite.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	function frame_getDataUri()
	{
		if (this.datauri.length === 0)
		{
			var tmpcanvas = document.createElement("canvas");
			tmpcanvas.width = this.width;
			tmpcanvas.height = this.height;
			var tmpctx = tmpcanvas.getContext("2d");
			if (this.spritesheeted)
			{
				tmpctx.drawImage(this.texture_img, this.offx, this.offy, this.width, this.height,
										 0, 0, this.width, this.height);
			}
			else
			{
				tmpctx.drawImage(this.texture_img, 0, 0, this.width, this.height);
			}
			this.datauri = tmpcanvas.toDataURL("image/png");
		}
		return this.datauri;
	};
	typeProto.onCreate = function()
	{
		if (this.is_family)
			return;
		var i, leni, j, lenj;
		var anim, frame, animobj, frameobj, wt, uv;
		this.all_frames = [];
		this.has_loaded_textures = false;
		for (i = 0, leni = this.animations.length; i < leni; i++)
		{
			anim = this.animations[i];
			animobj = {};
			animobj.name = anim[0];
			animobj.speed = anim[1];
			animobj.loop = anim[2];
			animobj.repeatcount = anim[3];
			animobj.repeatto = anim[4];
			animobj.pingpong = anim[5];
			animobj.sid = anim[6];
			animobj.frames = [];
			for (j = 0, lenj = anim[7].length; j < lenj; j++)
			{
				frame = anim[7][j];
				frameobj = {};
				frameobj.texture_file = frame[0];
				frameobj.texture_filesize = frame[1];
				frameobj.offx = frame[2];
				frameobj.offy = frame[3];
				frameobj.width = frame[4];
				frameobj.height = frame[5];
				frameobj.duration = frame[6];
				frameobj.hotspotX = frame[7];
				frameobj.hotspotY = frame[8];
				frameobj.image_points = frame[9];
				frameobj.poly_pts = frame[10];
				frameobj.pixelformat = frame[11];
				frameobj.spritesheeted = (frameobj.width !== 0);
				frameobj.datauri = "";		// generated on demand and cached
				frameobj.getDataUri = frame_getDataUri;
				uv = {};
				uv.left = 0;
				uv.top = 0;
				uv.right = 1;
				uv.bottom = 1;
				frameobj.sheetTex = uv;
				frameobj.webGL_texture = null;
				wt = this.runtime.findWaitingTexture(frame[0]);
				if (wt)
				{
					frameobj.texture_img = wt;
				}
				else
				{
					frameobj.texture_img = new Image();
					frameobj.texture_img.cr_src = frame[0];
					frameobj.texture_img.cr_filesize = frame[1];
					frameobj.texture_img.c2webGL_texture = null;
					this.runtime.waitForImageLoad(frameobj.texture_img, frame[0]);
				}
				cr.seal(frameobj);
				animobj.frames.push(frameobj);
				this.all_frames.push(frameobj);
			}
			cr.seal(animobj);
			this.animations[i] = animobj;		// swap array data for object
		}
	};
	typeProto.updateAllCurrentTexture = function ()
	{
		var i, len, inst;
		for (i = 0, len = this.instances.length; i < len; i++)
		{
			inst = this.instances[i];
			inst.curWebGLTexture = inst.curFrame.webGL_texture;
		}
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			frame.texture_img.c2webGL_texture = null;
			frame.webGL_texture = null;
		}
		this.has_loaded_textures = false;
		this.updateAllCurrentTexture();
	};
	typeProto.onRestoreWebGLContext = function ()
	{
		if (this.is_family || !this.instances.length)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			frame.webGL_texture = this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
		}
		this.updateAllCurrentTexture();
	};
	typeProto.loadTextures = function ()
	{
		if (this.is_family || this.has_loaded_textures || !this.runtime.glwrap)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			frame.webGL_texture = this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
		}
		this.has_loaded_textures = true;
	};
	typeProto.unloadTextures = function ()
	{
		if (this.is_family || this.instances.length || !this.has_loaded_textures)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			this.runtime.glwrap.deleteTexture(frame.webGL_texture);
			frame.webGL_texture = null;
		}
		this.has_loaded_textures = false;
	};
	var already_drawn_images = [];
	typeProto.preloadCanvas2D = function (ctx)
	{
		var i, len, frameimg;
		cr.clearArray(already_drawn_images);
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frameimg = this.all_frames[i].texture_img;
			if (already_drawn_images.indexOf(frameimg) !== -1)
					continue;
			ctx.drawImage(frameimg, 0, 0);
			already_drawn_images.push(frameimg);
		}
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		var poly_pts = this.type.animations[0].frames[0].poly_pts;
		if (this.recycled)
			this.collision_poly.set_pts(poly_pts);
		else
			this.collision_poly = new cr.CollisionPoly(poly_pts);
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		this.visible = (this.properties[0] === 0);	// 0=visible, 1=invisible
		this.isTicking = false;
		this.inAnimTrigger = false;
		this.collisionsEnabled = (this.properties[3] !== 0);
		this.cur_animation = this.getAnimationByName(this.properties[1]) || this.type.animations[0];
		this.cur_frame = this.properties[2];
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		var curanimframe = this.cur_animation.frames[this.cur_frame];
		this.collision_poly.set_pts(curanimframe.poly_pts);
		this.hotspotX = curanimframe.hotspotX;
		this.hotspotY = curanimframe.hotspotY;
		this.cur_anim_speed = this.cur_animation.speed;
		this.cur_anim_repeatto = this.cur_animation.repeatto;
		if (!(this.type.animations.length === 1 && this.type.animations[0].frames.length === 1) && this.cur_anim_speed !== 0)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		if (this.recycled)
			this.animTimer.reset();
		else
			this.animTimer = new cr.KahanAdder();
		this.frameStart = this.getNowTime();
		this.animPlaying = true;
		this.animRepeats = 0;
		this.animForwards = true;
		this.animTriggerName = "";
		this.changeAnimName = "";
		this.changeAnimFrom = 0;
		this.changeAnimFrame = -1;
		this.type.loadTextures();
		var i, leni, j, lenj;
		var anim, frame, uv, maintex;
		for (i = 0, leni = this.type.animations.length; i < leni; i++)
		{
			anim = this.type.animations[i];
			for (j = 0, lenj = anim.frames.length; j < lenj; j++)
			{
				frame = anim.frames[j];
				if (frame.width === 0)
				{
					frame.width = frame.texture_img.width;
					frame.height = frame.texture_img.height;
				}
				if (frame.spritesheeted)
				{
					maintex = frame.texture_img;
					uv = frame.sheetTex;
					uv.left = frame.offx / maintex.width;
					uv.top = frame.offy / maintex.height;
					uv.right = (frame.offx + frame.width) / maintex.width;
					uv.bottom = (frame.offy + frame.height) / maintex.height;
					if (frame.offx === 0 && frame.offy === 0 && frame.width === maintex.width && frame.height === maintex.height)
					{
						frame.spritesheeted = false;
					}
				}
			}
		}
		this.curFrame = this.cur_animation.frames[this.cur_frame];
		this.curWebGLTexture = this.curFrame.webGL_texture;
	};
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"a": this.cur_animation.sid,
			"f": this.cur_frame,
			"cas": this.cur_anim_speed,
			"fs": this.frameStart,
			"ar": this.animRepeats,
			"at": this.animTimer.sum,
			"rt": this.cur_anim_repeatto
		};
		if (!this.animPlaying)
			o["ap"] = this.animPlaying;
		if (!this.animForwards)
			o["af"] = this.animForwards;
		return o;
	};
	instanceProto.loadFromJSON = function (o)
	{
		var anim = this.getAnimationBySid(o["a"]);
		if (anim)
			this.cur_animation = anim;
		this.cur_frame = o["f"];
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		this.cur_anim_speed = o["cas"];
		this.frameStart = o["fs"];
		this.animRepeats = o["ar"];
		this.animTimer.reset();
		this.animTimer.sum = o["at"];
		this.animPlaying = o.hasOwnProperty("ap") ? o["ap"] : true;
		this.animForwards = o.hasOwnProperty("af") ? o["af"] : true;
		if (o.hasOwnProperty("rt"))
			this.cur_anim_repeatto = o["rt"];
		else
			this.cur_anim_repeatto = this.cur_animation.repeatto;
		this.curFrame = this.cur_animation.frames[this.cur_frame];
		this.curWebGLTexture = this.curFrame.webGL_texture;
		this.collision_poly.set_pts(this.curFrame.poly_pts);
		this.hotspotX = this.curFrame.hotspotX;
		this.hotspotY = this.curFrame.hotspotY;
	};
	instanceProto.animationFinish = function (reverse)
	{
		this.cur_frame = reverse ? 0 : this.cur_animation.frames.length - 1;
		this.animPlaying = false;
		this.animTriggerName = this.cur_animation.name;
		this.inAnimTrigger = true;
		this.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnAnyAnimFinished, this);
		this.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnAnimFinished, this);
		this.inAnimTrigger = false;
		this.animRepeats = 0;
	};
	instanceProto.getNowTime = function()
	{
		return this.animTimer.sum;
	};
	instanceProto.tick = function()
	{
		this.animTimer.add(this.runtime.getDt(this));
		if (this.changeAnimName.length)
			this.doChangeAnim();
		if (this.changeAnimFrame >= 0)
			this.doChangeAnimFrame();
		var now = this.getNowTime();
		var cur_animation = this.cur_animation;
		var prev_frame = cur_animation.frames[this.cur_frame];
		var next_frame;
		var cur_frame_time = prev_frame.duration / this.cur_anim_speed;
		if (this.animPlaying && now >= this.frameStart + cur_frame_time)
		{
			if (this.animForwards)
			{
				this.cur_frame++;
			}
			else
			{
				this.cur_frame--;
			}
			this.frameStart += cur_frame_time;
			if (this.cur_frame >= cur_animation.frames.length)
			{
				if (cur_animation.pingpong)
				{
					this.animForwards = false;
					this.cur_frame = cur_animation.frames.length - 2;
				}
				else if (cur_animation.loop)
				{
					this.cur_frame = this.cur_anim_repeatto;
				}
				else
				{
					this.animRepeats++;
					if (this.animRepeats >= cur_animation.repeatcount)
					{
						this.animationFinish(false);
					}
					else
					{
						this.cur_frame = this.cur_anim_repeatto;
					}
				}
			}
			if (this.cur_frame < 0)
			{
				if (cur_animation.pingpong)
				{
					this.cur_frame = 1;
					this.animForwards = true;
					if (!cur_animation.loop)
					{
						this.animRepeats++;
						if (this.animRepeats >= cur_animation.repeatcount)
						{
							this.animationFinish(true);
						}
					}
				}
				else
				{
					if (cur_animation.loop)
					{
						this.cur_frame = this.cur_anim_repeatto;
					}
					else
					{
						this.animRepeats++;
						if (this.animRepeats >= cur_animation.repeatcount)
						{
							this.animationFinish(true);
						}
						else
						{
							this.cur_frame = this.cur_anim_repeatto;
						}
					}
				}
			}
			if (this.cur_frame < 0)
				this.cur_frame = 0;
			else if (this.cur_frame >= cur_animation.frames.length)
				this.cur_frame = cur_animation.frames.length - 1;
			if (now > this.frameStart + (cur_animation.frames[this.cur_frame].duration / this.cur_anim_speed))
			{
				this.frameStart = now;
			}
			next_frame = cur_animation.frames[this.cur_frame];
			this.OnFrameChanged(prev_frame, next_frame);
			this.runtime.redraw = true;
		}
	};
	instanceProto.getAnimationByName = function (name_)
	{
		var i, len, a;
		for (i = 0, len = this.type.animations.length; i < len; i++)
		{
			a = this.type.animations[i];
			if (cr.equals_nocase(a.name, name_))
				return a;
		}
		return null;
	};
	instanceProto.getAnimationBySid = function (sid_)
	{
		var i, len, a;
		for (i = 0, len = this.type.animations.length; i < len; i++)
		{
			a = this.type.animations[i];
			if (a.sid === sid_)
				return a;
		}
		return null;
	};
	instanceProto.doChangeAnim = function ()
	{
		var prev_frame = this.cur_animation.frames[this.cur_frame];
		var anim = this.getAnimationByName(this.changeAnimName);
		this.changeAnimName = "";
		if (!anim)
			return;
		if (cr.equals_nocase(anim.name, this.cur_animation.name) && this.animPlaying)
			return;
		this.cur_animation = anim;
		this.cur_anim_speed = anim.speed;
		this.cur_anim_repeatto = anim.repeatto;
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		if (this.changeAnimFrom === 1)
			this.cur_frame = 0;
		this.animPlaying = true;
		this.frameStart = this.getNowTime();
		this.animForwards = true;
		this.OnFrameChanged(prev_frame, this.cur_animation.frames[this.cur_frame]);
		this.runtime.redraw = true;
	};
	instanceProto.doChangeAnimFrame = function ()
	{
		var prev_frame = this.cur_animation.frames[this.cur_frame];
		var prev_frame_number = this.cur_frame;
		this.cur_frame = cr.floor(this.changeAnimFrame);
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		if (prev_frame_number !== this.cur_frame)
		{
			this.OnFrameChanged(prev_frame, this.cur_animation.frames[this.cur_frame]);
			this.frameStart = this.getNowTime();
			this.runtime.redraw = true;
		}
		this.changeAnimFrame = -1;
	};
	instanceProto.OnFrameChanged = function (prev_frame, next_frame)
	{
		var oldw = prev_frame.width;
		var oldh = prev_frame.height;
		var neww = next_frame.width;
		var newh = next_frame.height;
		if (oldw != neww)
			this.width *= (neww / oldw);
		if (oldh != newh)
			this.height *= (newh / oldh);
		this.hotspotX = next_frame.hotspotX;
		this.hotspotY = next_frame.hotspotY;
		this.collision_poly.set_pts(next_frame.poly_pts);
		this.set_bbox_changed();
		this.curFrame = next_frame;
		this.curWebGLTexture = next_frame.webGL_texture;
		var i, len, b;
		for (i = 0, len = this.behavior_insts.length; i < len; i++)
		{
			b = this.behavior_insts[i];
			if (b.onSpriteFrameChanged)
				b.onSpriteFrameChanged(prev_frame, next_frame);
		}
		this.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnFrameChanged, this);
	};
	instanceProto.draw = function(ctx)
	{
		ctx.globalAlpha = this.opacity;
		var cur_frame = this.curFrame;
		var spritesheeted = cur_frame.spritesheeted;
		var cur_image = cur_frame.texture_img;
		var myx = this.x;
		var myy = this.y;
		var w = this.width;
		var h = this.height;
		if (this.angle === 0 && w >= 0 && h >= 0)
		{
			myx -= this.hotspotX * w;
			myy -= this.hotspotY * h;
			if (this.runtime.pixel_rounding)
			{
				myx = Math.round(myx);
				myy = Math.round(myy);
			}
			if (spritesheeted)
			{
				ctx.drawImage(cur_image, cur_frame.offx, cur_frame.offy, cur_frame.width, cur_frame.height,
										 myx, myy, w, h);
			}
			else
			{
				ctx.drawImage(cur_image, myx, myy, w, h);
			}
		}
		else
		{
			if (this.runtime.pixel_rounding)
			{
				myx = Math.round(myx);
				myy = Math.round(myy);
			}
			ctx.save();
			var widthfactor = w > 0 ? 1 : -1;
			var heightfactor = h > 0 ? 1 : -1;
			ctx.translate(myx, myy);
			if (widthfactor !== 1 || heightfactor !== 1)
				ctx.scale(widthfactor, heightfactor);
			ctx.rotate(this.angle * widthfactor * heightfactor);
			var drawx = 0 - (this.hotspotX * cr.abs(w))
			var drawy = 0 - (this.hotspotY * cr.abs(h));
			if (spritesheeted)
			{
				ctx.drawImage(cur_image, cur_frame.offx, cur_frame.offy, cur_frame.width, cur_frame.height,
										 drawx, drawy, cr.abs(w), cr.abs(h));
			}
			else
			{
				ctx.drawImage(cur_image, drawx, drawy, cr.abs(w), cr.abs(h));
			}
			ctx.restore();
		}
		/*
		ctx.strokeStyle = "#f00";
		ctx.lineWidth = 3;
		ctx.beginPath();
		this.collision_poly.cache_poly(this.width, this.height, this.angle);
		var i, len, ax, ay, bx, by;
		for (i = 0, len = this.collision_poly.pts_count; i < len; i++)
		{
			ax = this.collision_poly.pts_cache[i*2] + this.x;
			ay = this.collision_poly.pts_cache[i*2+1] + this.y;
			bx = this.collision_poly.pts_cache[((i+1)%len)*2] + this.x;
			by = this.collision_poly.pts_cache[((i+1)%len)*2+1] + this.y;
			ctx.moveTo(ax, ay);
			ctx.lineTo(bx, by);
		}
		ctx.stroke();
		ctx.closePath();
		*/
		/*
		if (this.behavior_insts.length >= 1 && this.behavior_insts[0].draw)
		{
			this.behavior_insts[0].draw(ctx);
		}
		*/
	};
	instanceProto.drawGL_earlyZPass = function(glw)
	{
		this.drawGL(glw);
	};
	instanceProto.drawGL = function(glw)
	{
		glw.setTexture(this.curWebGLTexture);
		glw.setOpacity(this.opacity);
		var cur_frame = this.curFrame;
		var q = this.bquad;
		if (this.runtime.pixel_rounding)
		{
			var ox = Math.round(this.x) - this.x;
			var oy = Math.round(this.y) - this.y;
			if (cur_frame.spritesheeted)
				glw.quadTex(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy, cur_frame.sheetTex);
			else
				glw.quad(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy);
		}
		else
		{
			if (cur_frame.spritesheeted)
				glw.quadTex(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly, cur_frame.sheetTex);
			else
				glw.quad(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly);
		}
	};
	instanceProto.getImagePointIndexByName = function(name_)
	{
		var cur_frame = this.curFrame;
		var i, len;
		for (i = 0, len = cur_frame.image_points.length; i < len; i++)
		{
			if (cr.equals_nocase(name_, cur_frame.image_points[i][0]))
				return i;
		}
		return -1;
	};
	instanceProto.getImagePoint = function(imgpt, getX)
	{
		var cur_frame = this.curFrame;
		var image_points = cur_frame.image_points;
		var index;
		if (cr.is_string(imgpt))
			index = this.getImagePointIndexByName(imgpt);
		else
			index = imgpt - 1;	// 0 is origin
		index = cr.floor(index);
		if (index < 0 || index >= image_points.length)
			return getX ? this.x : this.y;	// return origin
		var x = (image_points[index][1] - cur_frame.hotspotX) * this.width;
		var y = image_points[index][2];
		y = (y - cur_frame.hotspotY) * this.height;
		var cosa = Math.cos(this.angle);
		var sina = Math.sin(this.angle);
		var x_temp = (x * cosa) - (y * sina);
		y = (y * cosa) + (x * sina);
		x = x_temp;
		x += this.x;
		y += this.y;
		return getX ? x : y;
	};
	function Cnds() {};
	var arrCache = [];
	function allocArr()
	{
		if (arrCache.length)
			return arrCache.pop();
		else
			return [0, 0, 0];
	};
	function freeArr(a)
	{
		a[0] = 0;
		a[1] = 0;
		a[2] = 0;
		arrCache.push(a);
	};
	function makeCollKey(a, b)
	{
		if (a < b)
			return "" + a + "," + b;
		else
			return "" + b + "," + a;
	};
	function collmemory_add(collmemory, a, b, tickcount)
	{
		var a_uid = a.uid;
		var b_uid = b.uid;
		var key = makeCollKey(a_uid, b_uid);
		if (collmemory.hasOwnProperty(key))
		{
			collmemory[key][2] = tickcount;
			return;
		}
		var arr = allocArr();
		arr[0] = a_uid;
		arr[1] = b_uid;
		arr[2] = tickcount;
		collmemory[key] = arr;
	};
	function collmemory_remove(collmemory, a, b)
	{
		var key = makeCollKey(a.uid, b.uid);
		if (collmemory.hasOwnProperty(key))
		{
			freeArr(collmemory[key]);
			delete collmemory[key];
		}
	};
	function collmemory_removeInstance(collmemory, inst)
	{
		var uid = inst.uid;
		var p, entry;
		for (p in collmemory)
		{
			if (collmemory.hasOwnProperty(p))
			{
				entry = collmemory[p];
				if (entry[0] === uid || entry[1] === uid)
				{
					freeArr(collmemory[p]);
					delete collmemory[p];
				}
			}
		}
	};
	var last_coll_tickcount = -2;
	function collmemory_has(collmemory, a, b)
	{
		var key = makeCollKey(a.uid, b.uid);
		if (collmemory.hasOwnProperty(key))
		{
			last_coll_tickcount = collmemory[key][2];
			return true;
		}
		else
		{
			last_coll_tickcount = -2;
			return false;
		}
	};
	var candidates1 = [];
	Cnds.prototype.OnCollision = function (rtype)
	{
		if (!rtype)
			return false;
		var runtime = this.runtime;
		var cnd = runtime.getCurrentCondition();
		var ltype = cnd.type;
		var collmemory = null;
		if (cnd.extra["collmemory"])
		{
			collmemory = cnd.extra["collmemory"];
		}
		else
		{
			collmemory = {};
			cnd.extra["collmemory"] = collmemory;
		}
		if (!cnd.extra["spriteCreatedDestroyCallback"])
		{
			cnd.extra["spriteCreatedDestroyCallback"] = true;
			runtime.addDestroyCallback(function(inst) {
				collmemory_removeInstance(cnd.extra["collmemory"], inst);
			});
		}
		var lsol = ltype.getCurrentSol();
		var rsol = rtype.getCurrentSol();
		var linstances = lsol.getObjects();
		var rinstances;
		var registeredInstances;
		var l, linst, r, rinst;
		var curlsol, currsol;
		var tickcount = this.runtime.tickcount;
		var lasttickcount = tickcount - 1;
		var exists, run;
		var current_event = runtime.getCurrentEventStack().current_event;
		var orblock = current_event.orblock;
		for (l = 0; l < linstances.length; l++)
		{
			linst = linstances[l];
			if (rsol.select_all)
			{
				linst.update_bbox();
				this.runtime.getCollisionCandidates(linst.layer, rtype, linst.bbox, candidates1);
				rinstances = candidates1;
				this.runtime.addRegisteredCollisionCandidates(linst, rtype, rinstances);
			}
			else
			{
				rinstances = rsol.getObjects();
			}
			for (r = 0; r < rinstances.length; r++)
			{
				rinst = rinstances[r];
				if (runtime.testOverlap(linst, rinst) || runtime.checkRegisteredCollision(linst, rinst))
				{
					exists = collmemory_has(collmemory, linst, rinst);
					run = (!exists || (last_coll_tickcount < lasttickcount));
					collmemory_add(collmemory, linst, rinst, tickcount);
					if (run)
					{
						runtime.pushCopySol(current_event.solModifiers);
						curlsol = ltype.getCurrentSol();
						currsol = rtype.getCurrentSol();
						curlsol.select_all = false;
						currsol.select_all = false;
						if (ltype === rtype)
						{
							curlsol.instances.length = 2;	// just use lsol, is same reference as rsol
							curlsol.instances[0] = linst;
							curlsol.instances[1] = rinst;
							ltype.applySolToContainer();
						}
						else
						{
							curlsol.instances.length = 1;
							currsol.instances.length = 1;
							curlsol.instances[0] = linst;
							currsol.instances[0] = rinst;
							ltype.applySolToContainer();
							rtype.applySolToContainer();
						}
						current_event.retrigger();
						runtime.popSol(current_event.solModifiers);
					}
				}
				else
				{
					collmemory_remove(collmemory, linst, rinst);
				}
			}
			cr.clearArray(candidates1);
		}
		return false;
	};
	var rpicktype = null;
	var rtopick = new cr.ObjectSet();
	var needscollisionfinish = false;
	var candidates2 = [];
	var temp_bbox = new cr.rect(0, 0, 0, 0);
	function DoOverlapCondition(rtype, offx, offy)
	{
		if (!rtype)
			return false;
		var do_offset = (offx !== 0 || offy !== 0);
		var oldx, oldy, ret = false, r, lenr, rinst;
		var cnd = this.runtime.getCurrentCondition();
		var ltype = cnd.type;
		var inverted = cnd.inverted;
		var rsol = rtype.getCurrentSol();
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var rinstances;
		if (rsol.select_all)
		{
			this.update_bbox();
			temp_bbox.copy(this.bbox);
			temp_bbox.offset(offx, offy);
			this.runtime.getCollisionCandidates(this.layer, rtype, temp_bbox, candidates2);
			rinstances = candidates2;
		}
		else if (orblock)
		{
			if (this.runtime.isCurrentConditionFirst() && !rsol.else_instances.length && rsol.instances.length)
				rinstances = rsol.instances;
			else
				rinstances = rsol.else_instances;
		}
		else
		{
			rinstances = rsol.instances;
		}
		rpicktype = rtype;
		needscollisionfinish = (ltype !== rtype && !inverted);
		if (do_offset)
		{
			oldx = this.x;
			oldy = this.y;
			this.x += offx;
			this.y += offy;
			this.set_bbox_changed();
		}
		for (r = 0, lenr = rinstances.length; r < lenr; r++)
		{
			rinst = rinstances[r];
			if (this.runtime.testOverlap(this, rinst))
			{
				ret = true;
				if (inverted)
					break;
				if (ltype !== rtype)
					rtopick.add(rinst);
			}
		}
		if (do_offset)
		{
			this.x = oldx;
			this.y = oldy;
			this.set_bbox_changed();
		}
		cr.clearArray(candidates2);
		return ret;
	};
	typeProto.finish = function (do_pick)
	{
		if (!needscollisionfinish)
			return;
		if (do_pick)
		{
			var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
			var sol = rpicktype.getCurrentSol();
			var topick = rtopick.valuesRef();
			var i, len, inst;
			if (sol.select_all)
			{
				sol.select_all = false;
				cr.clearArray(sol.instances);
				for (i = 0, len = topick.length; i < len; ++i)
				{
					sol.instances[i] = topick[i];
				}
				if (orblock)
				{
					cr.clearArray(sol.else_instances);
					for (i = 0, len = rpicktype.instances.length; i < len; ++i)
					{
						inst = rpicktype.instances[i];
						if (!rtopick.contains(inst))
							sol.else_instances.push(inst);
					}
				}
			}
			else
			{
				if (orblock)
				{
					var initsize = sol.instances.length;
					for (i = 0, len = topick.length; i < len; ++i)
					{
						sol.instances[initsize + i] = topick[i];
						cr.arrayFindRemove(sol.else_instances, topick[i]);
					}
				}
				else
				{
					cr.shallowAssignArray(sol.instances, topick);
				}
			}
			rpicktype.applySolToContainer();
		}
		rtopick.clear();
		needscollisionfinish = false;
	};
	Cnds.prototype.IsOverlapping = function (rtype)
	{
		return DoOverlapCondition.call(this, rtype, 0, 0);
	};
	Cnds.prototype.IsOverlappingOffset = function (rtype, offx, offy)
	{
		return DoOverlapCondition.call(this, rtype, offx, offy);
	};
	Cnds.prototype.IsAnimPlaying = function (animname)
	{
		if (this.changeAnimName.length)
			return cr.equals_nocase(this.changeAnimName, animname);
		else
			return cr.equals_nocase(this.cur_animation.name, animname);
	};
	Cnds.prototype.CompareFrame = function (cmp, framenum)
	{
		return cr.do_cmp(this.cur_frame, cmp, framenum);
	};
	Cnds.prototype.CompareAnimSpeed = function (cmp, x)
	{
		var s = (this.animForwards ? this.cur_anim_speed : -this.cur_anim_speed);
		return cr.do_cmp(s, cmp, x);
	};
	Cnds.prototype.OnAnimFinished = function (animname)
	{
		return cr.equals_nocase(this.animTriggerName, animname);
	};
	Cnds.prototype.OnAnyAnimFinished = function ()
	{
		return true;
	};
	Cnds.prototype.OnFrameChanged = function ()
	{
		return true;
	};
	Cnds.prototype.IsMirrored = function ()
	{
		return this.width < 0;
	};
	Cnds.prototype.IsFlipped = function ()
	{
		return this.height < 0;
	};
	Cnds.prototype.OnURLLoaded = function ()
	{
		return true;
	};
	Cnds.prototype.IsCollisionEnabled = function ()
	{
		return this.collisionsEnabled;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Spawn = function (obj, layer, imgpt)
	{
		if (!obj || !layer)
			return;
		var inst = this.runtime.createInstance(obj, layer, this.getImagePoint(imgpt, true), this.getImagePoint(imgpt, false));
		if (!inst)
			return;
		if (typeof inst.angle !== "undefined")
		{
			inst.angle = this.angle;
			inst.set_bbox_changed();
		}
		this.runtime.isInOnDestroy++;
		var i, len, s;
		this.runtime.trigger(Object.getPrototypeOf(obj.plugin).cnds.OnCreated, inst);
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				s = inst.siblings[i];
				this.runtime.trigger(Object.getPrototypeOf(s.type.plugin).cnds.OnCreated, s);
			}
		}
		this.runtime.isInOnDestroy--;
		var cur_act = this.runtime.getCurrentAction();
		var reset_sol = false;
		if (cr.is_undefined(cur_act.extra["Spawn_LastExec"]) || cur_act.extra["Spawn_LastExec"] < this.runtime.execcount)
		{
			reset_sol = true;
			cur_act.extra["Spawn_LastExec"] = this.runtime.execcount;
		}
		var sol;
		if (obj != this.type)
		{
			sol = obj.getCurrentSol();
			sol.select_all = false;
			if (reset_sol)
			{
				cr.clearArray(sol.instances);
				sol.instances[0] = inst;
			}
			else
				sol.instances.push(inst);
			if (inst.is_contained)
			{
				for (i = 0, len = inst.siblings.length; i < len; i++)
				{
					s = inst.siblings[i];
					sol = s.type.getCurrentSol();
					sol.select_all = false;
					if (reset_sol)
					{
						cr.clearArray(sol.instances);
						sol.instances[0] = s;
					}
					else
						sol.instances.push(s);
				}
			}
		}
	};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	Acts.prototype.StopAnim = function ()
	{
		this.animPlaying = false;
	};
	Acts.prototype.StartAnim = function (from)
	{
		this.animPlaying = true;
		this.frameStart = this.getNowTime();
		if (from === 1 && this.cur_frame !== 0)
		{
			this.changeAnimFrame = 0;
			if (!this.inAnimTrigger)
				this.doChangeAnimFrame();
		}
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
	};
	Acts.prototype.SetAnim = function (animname, from)
	{
		this.changeAnimName = animname;
		this.changeAnimFrom = from;
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		if (!this.inAnimTrigger)
			this.doChangeAnim();
	};
	Acts.prototype.SetAnimFrame = function (framenumber)
	{
		this.changeAnimFrame = framenumber;
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		if (!this.inAnimTrigger)
			this.doChangeAnimFrame();
	};
	Acts.prototype.SetAnimSpeed = function (s)
	{
		this.cur_anim_speed = cr.abs(s);
		this.animForwards = (s >= 0);
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
	};
	Acts.prototype.SetAnimRepeatToFrame = function (s)
	{
		s = Math.floor(s);
		if (s < 0)
			s = 0;
		if (s >= this.cur_animation.frames.length)
			s = this.cur_animation.frames.length - 1;
		this.cur_anim_repeatto = s;
	};
	Acts.prototype.SetMirrored = function (m)
	{
		var neww = cr.abs(this.width) * (m === 0 ? -1 : 1);
		if (this.width === neww)
			return;
		this.width = neww;
		this.set_bbox_changed();
	};
	Acts.prototype.SetFlipped = function (f)
	{
		var newh = cr.abs(this.height) * (f === 0 ? -1 : 1);
		if (this.height === newh)
			return;
		this.height = newh;
		this.set_bbox_changed();
	};
	Acts.prototype.SetScale = function (s)
	{
		var cur_frame = this.curFrame;
		var mirror_factor = (this.width < 0 ? -1 : 1);
		var flip_factor = (this.height < 0 ? -1 : 1);
		var new_width = cur_frame.width * s * mirror_factor;
		var new_height = cur_frame.height * s * flip_factor;
		if (this.width !== new_width || this.height !== new_height)
		{
			this.width = new_width;
			this.height = new_height;
			this.set_bbox_changed();
		}
	};
	Acts.prototype.LoadURL = function (url_, resize_, crossOrigin_)
	{
		var img = new Image();
		var self = this;
		var curFrame_ = this.curFrame;
		img.onload = function ()
		{
			if (curFrame_.texture_img.src === img.src)
			{
				if (self.runtime.glwrap && self.curFrame === curFrame_)
					self.curWebGLTexture = curFrame_.webGL_texture;
				if (resize_ === 0)		// resize to image size
				{
					self.width = img.width;
					self.height = img.height;
					self.set_bbox_changed();
				}
				self.runtime.redraw = true;
				self.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnURLLoaded, self);
				return;
			}
			curFrame_.texture_img = img;
			curFrame_.offx = 0;
			curFrame_.offy = 0;
			curFrame_.width = img.width;
			curFrame_.height = img.height;
			curFrame_.spritesheeted = false;
			curFrame_.datauri = "";
			curFrame_.pixelformat = 0;	// reset to RGBA, since we don't know what type of image will have come in
			if (self.runtime.glwrap)
			{
				if (curFrame_.webGL_texture)
					self.runtime.glwrap.deleteTexture(curFrame_.webGL_texture);
				curFrame_.webGL_texture = self.runtime.glwrap.loadTexture(img, false, self.runtime.linearSampling);
				if (self.curFrame === curFrame_)
					self.curWebGLTexture = curFrame_.webGL_texture;
				self.type.updateAllCurrentTexture();
			}
			if (resize_ === 0)		// resize to image size
			{
				self.width = img.width;
				self.height = img.height;
				self.set_bbox_changed();
			}
			self.runtime.redraw = true;
			self.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnURLLoaded, self);
		};
		if (url_.substr(0, 5) !== "data:" && crossOrigin_ === 0)
			img["crossOrigin"] = "anonymous";
		this.runtime.setImageSrc(img, url_);
	};
	Acts.prototype.SetCollisions = function (set_)
	{
		if (this.collisionsEnabled === (set_ !== 0))
			return;		// no change
		this.collisionsEnabled = (set_ !== 0);
		if (this.collisionsEnabled)
			this.set_bbox_changed();		// needs to be added back to cells
		else
		{
			if (this.collcells.right >= this.collcells.left)
				this.type.collision_grid.update(this, this.collcells, null);
			this.collcells.set(0, 0, -1, -1);
		}
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.AnimationFrame = function (ret)
	{
		ret.set_int(this.cur_frame);
	};
	Exps.prototype.AnimationFrameCount = function (ret)
	{
		ret.set_int(this.cur_animation.frames.length);
	};
	Exps.prototype.AnimationName = function (ret)
	{
		ret.set_string(this.cur_animation.name);
	};
	Exps.prototype.AnimationSpeed = function (ret)
	{
		ret.set_float(this.animForwards ? this.cur_anim_speed : -this.cur_anim_speed);
	};
	Exps.prototype.ImagePointX = function (ret, imgpt)
	{
		ret.set_float(this.getImagePoint(imgpt, true));
	};
	Exps.prototype.ImagePointY = function (ret, imgpt)
	{
		ret.set_float(this.getImagePoint(imgpt, false));
	};
	Exps.prototype.ImagePointCount = function (ret)
	{
		ret.set_int(this.curFrame.image_points.length);
	};
	Exps.prototype.ImageWidth = function (ret)
	{
		ret.set_float(this.curFrame.width);
	};
	Exps.prototype.ImageHeight = function (ret)
	{
		ret.set_float(this.curFrame.height);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Text = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Text.prototype;
	pluginProto.onCreate = function ()
	{
		pluginProto.acts.SetWidth = function (w)
		{
			if (this.width !== w)
			{
				this.width = w;
				this.text_changed = true;	// also recalculate text wrapping
				this.set_bbox_changed();
			}
		};
	};
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		var i, len, inst;
		for (i = 0, len = this.instances.length; i < len; i++)
		{
			inst = this.instances[i];
			inst.mycanvas = null;
			inst.myctx = null;
			inst.mytex = null;
		}
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		if (this.recycled)
			cr.clearArray(this.lines);
		else
			this.lines = [];		// for word wrapping
		this.text_changed = true;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var requestedWebFonts = {};		// already requested web fonts have an entry here
	instanceProto.onCreate = function()
	{
		this.text = this.properties[0];
		this.visible = (this.properties[1] === 0);		// 0=visible, 1=invisible
		this.font = this.properties[2];
		this.color = this.properties[3];
		this.halign = this.properties[4];				// 0=left, 1=center, 2=right
		this.valign = this.properties[5];				// 0=top, 1=center, 2=bottom
		this.wrapbyword = (this.properties[7] === 0);	// 0=word, 1=character
		this.lastwidth = this.width;
		this.lastwrapwidth = this.width;
		this.lastheight = this.height;
		this.line_height_offset = this.properties[8];
		this.facename = "";
		this.fontstyle = "";
		this.ptSize = 0;
		this.textWidth = 0;
		this.textHeight = 0;
		this.parseFont();
		this.mycanvas = null;
		this.myctx = null;
		this.mytex = null;
		this.need_text_redraw = false;
		this.last_render_tick = this.runtime.tickcount;
		if (this.recycled)
			this.rcTex.set(0, 0, 1, 1);
		else
			this.rcTex = new cr.rect(0, 0, 1, 1);
		if (this.runtime.glwrap)
			this.runtime.tickMe(this);
;
	};
	instanceProto.parseFont = function ()
	{
		var arr = this.font.split(" ");
		var i;
		for (i = 0; i < arr.length; i++)
		{
			if (arr[i].substr(arr[i].length - 2, 2) === "pt")
			{
				this.ptSize = parseInt(arr[i].substr(0, arr[i].length - 2));
				this.pxHeight = Math.ceil((this.ptSize / 72.0) * 96.0) + 4;	// assume 96dpi...
				if (i > 0)
					this.fontstyle = arr[i - 1];
				this.facename = arr[i + 1];
				for (i = i + 2; i < arr.length; i++)
					this.facename += " " + arr[i];
				break;
			}
		}
	};
	instanceProto.saveToJSON = function ()
	{
		return {
			"t": this.text,
			"f": this.font,
			"c": this.color,
			"ha": this.halign,
			"va": this.valign,
			"wr": this.wrapbyword,
			"lho": this.line_height_offset,
			"fn": this.facename,
			"fs": this.fontstyle,
			"ps": this.ptSize,
			"pxh": this.pxHeight,
			"tw": this.textWidth,
			"th": this.textHeight,
			"lrt": this.last_render_tick
		};
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.text = o["t"];
		this.font = o["f"];
		this.color = o["c"];
		this.halign = o["ha"];
		this.valign = o["va"];
		this.wrapbyword = o["wr"];
		this.line_height_offset = o["lho"];
		this.facename = o["fn"];
		this.fontstyle = o["fs"];
		this.ptSize = o["ps"];
		this.pxHeight = o["pxh"];
		this.textWidth = o["tw"];
		this.textHeight = o["th"];
		this.last_render_tick = o["lrt"];
		this.text_changed = true;
		this.lastwidth = this.width;
		this.lastwrapwidth = this.width;
		this.lastheight = this.height;
	};
	instanceProto.tick = function ()
	{
		if (this.runtime.glwrap && this.mytex && (this.runtime.tickcount - this.last_render_tick >= 300))
		{
			var layer = this.layer;
            this.update_bbox();
            var bbox = this.bbox;
            if (bbox.right < layer.viewLeft || bbox.bottom < layer.viewTop || bbox.left > layer.viewRight || bbox.top > layer.viewBottom)
			{
				this.runtime.glwrap.deleteTexture(this.mytex);
				this.mytex = null;
				this.myctx = null;
				this.mycanvas = null;
			}
		}
	};
	instanceProto.onDestroy = function ()
	{
		this.myctx = null;
		this.mycanvas = null;
		if (this.runtime.glwrap && this.mytex)
			this.runtime.glwrap.deleteTexture(this.mytex);
		this.mytex = null;
	};
	instanceProto.updateFont = function ()
	{
		this.font = this.fontstyle + " " + this.ptSize.toString() + "pt " + this.facename;
		this.text_changed = true;
		this.runtime.redraw = true;
	};
	instanceProto.draw = function(ctx, glmode)
	{
		ctx.font = this.font;
		ctx.textBaseline = "top";
		ctx.fillStyle = this.color;
		ctx.globalAlpha = glmode ? 1 : this.opacity;
		var myscale = 1;
		if (glmode)
		{
			myscale = Math.abs(this.layer.getScale());
			ctx.save();
			ctx.scale(myscale, myscale);
		}
		if (this.text_changed || this.width !== this.lastwrapwidth)
		{
			this.type.plugin.WordWrap(this.text, this.lines, ctx, this.width, this.wrapbyword);
			this.text_changed = false;
			this.lastwrapwidth = this.width;
		}
		this.update_bbox();
		var penX = glmode ? 0 : this.bquad.tlx;
		var penY = glmode ? 0 : this.bquad.tly;
		if (this.runtime.pixel_rounding)
		{
			penX = (penX + 0.5) | 0;
			penY = (penY + 0.5) | 0;
		}
		if (this.angle !== 0 && !glmode)
		{
			ctx.save();
			ctx.translate(penX, penY);
			ctx.rotate(this.angle);
			penX = 0;
			penY = 0;
		}
		var endY = penY + this.height;
		var line_height = this.pxHeight;
		line_height += this.line_height_offset;
		var drawX;
		var i;
		if (this.valign === 1)		// center
			penY += Math.max(this.height / 2 - (this.lines.length * line_height) / 2, 0);
		else if (this.valign === 2)	// bottom
			penY += Math.max(this.height - (this.lines.length * line_height) - 2, 0);
		for (i = 0; i < this.lines.length; i++)
		{
			drawX = penX;
			if (this.halign === 1)		// center
				drawX = penX + (this.width - this.lines[i].width) / 2;
			else if (this.halign === 2)	// right
				drawX = penX + (this.width - this.lines[i].width);
			ctx.fillText(this.lines[i].text, drawX, penY);
			penY += line_height;
			if (penY >= endY - line_height)
				break;
		}
		if (this.angle !== 0 || glmode)
			ctx.restore();
		this.last_render_tick = this.runtime.tickcount;
	};
	instanceProto.drawGL = function(glw)
	{
		if (this.width < 1 || this.height < 1)
			return;
		var need_redraw = this.text_changed || this.need_text_redraw;
		this.need_text_redraw = false;
		var layer_scale = this.layer.getScale();
		var layer_angle = this.layer.getAngle();
		var rcTex = this.rcTex;
		var floatscaledwidth = layer_scale * this.width;
		var floatscaledheight = layer_scale * this.height;
		var scaledwidth = Math.ceil(floatscaledwidth);
		var scaledheight = Math.ceil(floatscaledheight);
		var absscaledwidth = Math.abs(scaledwidth);
		var absscaledheight = Math.abs(scaledheight);
		var halfw = this.runtime.draw_width / 2;
		var halfh = this.runtime.draw_height / 2;
		if (!this.myctx)
		{
			this.mycanvas = document.createElement("canvas");
			this.mycanvas.width = absscaledwidth;
			this.mycanvas.height = absscaledheight;
			this.lastwidth = absscaledwidth;
			this.lastheight = absscaledheight;
			need_redraw = true;
			this.myctx = this.mycanvas.getContext("2d");
		}
		if (absscaledwidth !== this.lastwidth || absscaledheight !== this.lastheight)
		{
			this.mycanvas.width = absscaledwidth;
			this.mycanvas.height = absscaledheight;
			if (this.mytex)
			{
				glw.deleteTexture(this.mytex);
				this.mytex = null;
			}
			need_redraw = true;
		}
		if (need_redraw)
		{
			this.myctx.clearRect(0, 0, absscaledwidth, absscaledheight);
			this.draw(this.myctx, true);
			if (!this.mytex)
				this.mytex = glw.createEmptyTexture(absscaledwidth, absscaledheight, this.runtime.linearSampling, this.runtime.isMobile);
			glw.videoToTexture(this.mycanvas, this.mytex, this.runtime.isMobile);
		}
		this.lastwidth = absscaledwidth;
		this.lastheight = absscaledheight;
		glw.setTexture(this.mytex);
		glw.setOpacity(this.opacity);
		glw.resetModelView();
		glw.translate(-halfw, -halfh);
		glw.updateModelView();
		var q = this.bquad;
		var tlx = this.layer.layerToCanvas(q.tlx, q.tly, true, true);
		var tly = this.layer.layerToCanvas(q.tlx, q.tly, false, true);
		var trx = this.layer.layerToCanvas(q.trx, q.try_, true, true);
		var try_ = this.layer.layerToCanvas(q.trx, q.try_, false, true);
		var brx = this.layer.layerToCanvas(q.brx, q.bry, true, true);
		var bry = this.layer.layerToCanvas(q.brx, q.bry, false, true);
		var blx = this.layer.layerToCanvas(q.blx, q.bly, true, true);
		var bly = this.layer.layerToCanvas(q.blx, q.bly, false, true);
		if (this.runtime.pixel_rounding || (this.angle === 0 && layer_angle === 0))
		{
			var ox = ((tlx + 0.5) | 0) - tlx;
			var oy = ((tly + 0.5) | 0) - tly
			tlx += ox;
			tly += oy;
			trx += ox;
			try_ += oy;
			brx += ox;
			bry += oy;
			blx += ox;
			bly += oy;
		}
		if (this.angle === 0 && layer_angle === 0)
		{
			trx = tlx + scaledwidth;
			try_ = tly;
			brx = trx;
			bry = tly + scaledheight;
			blx = tlx;
			bly = bry;
			rcTex.right = 1;
			rcTex.bottom = 1;
		}
		else
		{
			rcTex.right = floatscaledwidth / scaledwidth;
			rcTex.bottom = floatscaledheight / scaledheight;
		}
		glw.quadTex(tlx, tly, trx, try_, brx, bry, blx, bly, rcTex);
		glw.resetModelView();
		glw.scale(layer_scale, layer_scale);
		glw.rotateZ(-this.layer.getAngle());
		glw.translate((this.layer.viewLeft + this.layer.viewRight) / -2, (this.layer.viewTop + this.layer.viewBottom) / -2);
		glw.updateModelView();
		this.last_render_tick = this.runtime.tickcount;
	};
	var wordsCache = [];
	pluginProto.TokeniseWords = function (text)
	{
		cr.clearArray(wordsCache);
		var cur_word = "";
		var ch;
		var i = 0;
		while (i < text.length)
		{
			ch = text.charAt(i);
			if (ch === "\n")
			{
				if (cur_word.length)
				{
					wordsCache.push(cur_word);
					cur_word = "";
				}
				wordsCache.push("\n");
				++i;
			}
			else if (ch === " " || ch === "\t" || ch === "-")
			{
				do {
					cur_word += text.charAt(i);
					i++;
				}
				while (i < text.length && (text.charAt(i) === " " || text.charAt(i) === "\t"));
				wordsCache.push(cur_word);
				cur_word = "";
			}
			else if (i < text.length)
			{
				cur_word += ch;
				i++;
			}
		}
		if (cur_word.length)
			wordsCache.push(cur_word);
	};
	var linesCache = [];
	function allocLine()
	{
		if (linesCache.length)
			return linesCache.pop();
		else
			return {};
	};
	function freeLine(l)
	{
		linesCache.push(l);
	};
	function freeAllLines(arr)
	{
		var i, len;
		for (i = 0, len = arr.length; i < len; i++)
		{
			freeLine(arr[i]);
		}
		cr.clearArray(arr);
	};
	pluginProto.WordWrap = function (text, lines, ctx, width, wrapbyword)
	{
		if (!text || !text.length)
		{
			freeAllLines(lines);
			return;
		}
		if (width <= 2.0)
		{
			freeAllLines(lines);
			return;
		}
		if (text.length <= 100 && text.indexOf("\n") === -1)
		{
			var all_width = ctx.measureText(text).width;
			if (all_width <= width)
			{
				freeAllLines(lines);
				lines.push(allocLine());
				lines[0].text = text;
				lines[0].width = all_width;
				return;
			}
		}
		this.WrapText(text, lines, ctx, width, wrapbyword);
	};
	function trimSingleSpaceRight(str)
	{
		if (!str.length || str.charAt(str.length - 1) !== " ")
			return str;
		return str.substring(0, str.length - 1);
	};
	pluginProto.WrapText = function (text, lines, ctx, width, wrapbyword)
	{
		var wordArray;
		if (wrapbyword)
		{
			this.TokeniseWords(text);	// writes to wordsCache
			wordArray = wordsCache;
		}
		else
			wordArray = text;
		var cur_line = "";
		var prev_line;
		var line_width;
		var i;
		var lineIndex = 0;
		var line;
		for (i = 0; i < wordArray.length; i++)
		{
			if (wordArray[i] === "\n")
			{
				if (lineIndex >= lines.length)
					lines.push(allocLine());
				cur_line = trimSingleSpaceRight(cur_line);		// for correct center/right alignment
				line = lines[lineIndex];
				line.text = cur_line;
				line.width = ctx.measureText(cur_line).width;
				lineIndex++;
				cur_line = "";
				continue;
			}
			prev_line = cur_line;
			cur_line += wordArray[i];
			line_width = ctx.measureText(cur_line).width;
			if (line_width >= width)
			{
				if (lineIndex >= lines.length)
					lines.push(allocLine());
				prev_line = trimSingleSpaceRight(prev_line);
				line = lines[lineIndex];
				line.text = prev_line;
				line.width = ctx.measureText(prev_line).width;
				lineIndex++;
				cur_line = wordArray[i];
				if (!wrapbyword && cur_line === " ")
					cur_line = "";
			}
		}
		if (cur_line.length)
		{
			if (lineIndex >= lines.length)
				lines.push(allocLine());
			cur_line = trimSingleSpaceRight(cur_line);
			line = lines[lineIndex];
			line.text = cur_line;
			line.width = ctx.measureText(cur_line).width;
			lineIndex++;
		}
		for (i = lineIndex; i < lines.length; i++)
			freeLine(lines[i]);
		lines.length = lineIndex;
	};
	function Cnds() {};
	Cnds.prototype.CompareText = function(text_to_compare, case_sensitive)
	{
		if (case_sensitive)
			return this.text == text_to_compare;
		else
			return cr.equals_nocase(this.text, text_to_compare);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetText = function(param)
	{
		if (cr.is_number(param) && param < 1e9)
			param = Math.round(param * 1e10) / 1e10;	// round to nearest ten billionth - hides floating point errors
		var text_to_set = param.toString();
		if (this.text !== text_to_set)
		{
			this.text = text_to_set;
			this.text_changed = true;
			this.runtime.redraw = true;
		}
	};
	Acts.prototype.AppendText = function(param)
	{
		if (cr.is_number(param))
			param = Math.round(param * 1e10) / 1e10;	// round to nearest ten billionth - hides floating point errors
		var text_to_append = param.toString();
		if (text_to_append)	// not empty
		{
			this.text += text_to_append;
			this.text_changed = true;
			this.runtime.redraw = true;
		}
	};
	Acts.prototype.SetFontFace = function (face_, style_)
	{
		var newstyle = "";
		switch (style_) {
		case 1: newstyle = "bold"; break;
		case 2: newstyle = "italic"; break;
		case 3: newstyle = "bold italic"; break;
		}
		if (face_ === this.facename && newstyle === this.fontstyle)
			return;		// no change
		this.facename = face_;
		this.fontstyle = newstyle;
		this.updateFont();
	};
	Acts.prototype.SetFontSize = function (size_)
	{
		if (this.ptSize === size_)
			return;
		this.ptSize = size_;
		this.pxHeight = Math.ceil((this.ptSize / 72.0) * 96.0) + 4;	// assume 96dpi...
		this.updateFont();
	};
	Acts.prototype.SetFontColor = function (rgb)
	{
		var newcolor = "rgb(" + cr.GetRValue(rgb).toString() + "," + cr.GetGValue(rgb).toString() + "," + cr.GetBValue(rgb).toString() + ")";
		if (newcolor === this.color)
			return;
		this.color = newcolor;
		this.need_text_redraw = true;
		this.runtime.redraw = true;
	};
	Acts.prototype.SetWebFont = function (familyname_, cssurl_)
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Text plugin: 'Set web font' not supported on this platform - the action has been ignored");
			return;		// DC todo
		}
		var self = this;
		var refreshFunc = (function () {
							self.runtime.redraw = true;
							self.text_changed = true;
						});
		if (requestedWebFonts.hasOwnProperty(cssurl_))
		{
			var newfacename = "'" + familyname_ + "'";
			if (this.facename === newfacename)
				return;	// no change
			this.facename = newfacename;
			this.updateFont();
			for (var i = 1; i < 10; i++)
			{
				setTimeout(refreshFunc, i * 100);
				setTimeout(refreshFunc, i * 1000);
			}
			return;
		}
		var wf = document.createElement("link");
		wf.href = cssurl_;
		wf.rel = "stylesheet";
		wf.type = "text/css";
		wf.onload = refreshFunc;
		document.getElementsByTagName('head')[0].appendChild(wf);
		requestedWebFonts[cssurl_] = true;
		this.facename = "'" + familyname_ + "'";
		this.updateFont();
		for (var i = 1; i < 10; i++)
		{
			setTimeout(refreshFunc, i * 100);
			setTimeout(refreshFunc, i * 1000);
		}
;
	};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Text = function(ret)
	{
		ret.set_string(this.text);
	};
	Exps.prototype.FaceName = function (ret)
	{
		ret.set_string(this.facename);
	};
	Exps.prototype.FaceSize = function (ret)
	{
		ret.set_int(this.ptSize);
	};
	Exps.prototype.TextWidth = function (ret)
	{
		var w = 0;
		var i, len, x;
		for (i = 0, len = this.lines.length; i < len; i++)
		{
			x = this.lines[i].width;
			if (w < x)
				w = x;
		}
		ret.set_int(w);
	};
	Exps.prototype.TextHeight = function (ret)
	{
		ret.set_int(this.lines.length * (this.pxHeight + this.line_height_offset) - this.line_height_offset);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.TiledBg = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.TiledBg.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
		if (this.is_family)
			return;
		this.texture_img = new Image();
		this.texture_img.cr_filesize = this.texture_filesize;
		this.runtime.waitForImageLoad(this.texture_img, this.texture_file);
		this.pattern = null;
		this.webGL_texture = null;
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		this.webGL_texture = null;
	};
	typeProto.onRestoreWebGLContext = function ()
	{
		if (this.is_family || !this.instances.length)
			return;
		if (!this.webGL_texture)
		{
			this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
		}
		var i, len;
		for (i = 0, len = this.instances.length; i < len; i++)
			this.instances[i].webGL_texture = this.webGL_texture;
	};
	typeProto.loadTextures = function ()
	{
		if (this.is_family || this.webGL_texture || !this.runtime.glwrap)
			return;
		this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
	};
	typeProto.unloadTextures = function ()
	{
		if (this.is_family || this.instances.length || !this.webGL_texture)
			return;
		this.runtime.glwrap.deleteTexture(this.webGL_texture);
		this.webGL_texture = null;
	};
	typeProto.preloadCanvas2D = function (ctx)
	{
		ctx.drawImage(this.texture_img, 0, 0);
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		this.visible = (this.properties[0] === 0);							// 0=visible, 1=invisible
		this.rcTex = new cr.rect(0, 0, 0, 0);
		this.has_own_texture = false;										// true if a texture loaded in from URL
		this.texture_img = this.type.texture_img;
		if (this.runtime.glwrap)
		{
			this.type.loadTextures();
			this.webGL_texture = this.type.webGL_texture;
		}
		else
		{
			if (!this.type.pattern)
				this.type.pattern = this.runtime.ctx.createPattern(this.type.texture_img, "repeat");
			this.pattern = this.type.pattern;
		}
	};
	instanceProto.afterLoad = function ()
	{
		this.has_own_texture = false;
		this.texture_img = this.type.texture_img;
	};
	instanceProto.onDestroy = function ()
	{
		if (this.runtime.glwrap && this.has_own_texture && this.webGL_texture)
		{
			this.runtime.glwrap.deleteTexture(this.webGL_texture);
			this.webGL_texture = null;
		}
	};
	instanceProto.draw = function(ctx)
	{
		ctx.globalAlpha = this.opacity;
		ctx.save();
		ctx.fillStyle = this.pattern;
		var myx = this.x;
		var myy = this.y;
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		var drawX = -(this.hotspotX * this.width);
		var drawY = -(this.hotspotY * this.height);
		var offX = drawX % this.texture_img.width;
		var offY = drawY % this.texture_img.height;
		if (offX < 0)
			offX += this.texture_img.width;
		if (offY < 0)
			offY += this.texture_img.height;
		ctx.translate(myx, myy);
		ctx.rotate(this.angle);
		ctx.translate(offX, offY);
		ctx.fillRect(drawX - offX,
					 drawY - offY,
					 this.width,
					 this.height);
		ctx.restore();
	};
	instanceProto.drawGL_earlyZPass = function(glw)
	{
		this.drawGL(glw);
	};
	instanceProto.drawGL = function(glw)
	{
		glw.setTexture(this.webGL_texture);
		glw.setOpacity(this.opacity);
		var rcTex = this.rcTex;
		rcTex.right = this.width / this.texture_img.width;
		rcTex.bottom = this.height / this.texture_img.height;
		var q = this.bquad;
		if (this.runtime.pixel_rounding)
		{
			var ox = Math.round(this.x) - this.x;
			var oy = Math.round(this.y) - this.y;
			glw.quadTex(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy, rcTex);
		}
		else
			glw.quadTex(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly, rcTex);
	};
	function Cnds() {};
	Cnds.prototype.OnURLLoaded = function ()
	{
		return true;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	Acts.prototype.LoadURL = function (url_, crossOrigin_)
	{
		var img = new Image();
		var self = this;
		img.onload = function ()
		{
			self.texture_img = img;
			if (self.runtime.glwrap)
			{
				if (self.has_own_texture && self.webGL_texture)
					self.runtime.glwrap.deleteTexture(self.webGL_texture);
				self.webGL_texture = self.runtime.glwrap.loadTexture(img, true, self.runtime.linearSampling);
			}
			else
			{
				self.pattern = self.runtime.ctx.createPattern(img, "repeat");
			}
			self.has_own_texture = true;
			self.runtime.redraw = true;
			self.runtime.trigger(cr.plugins_.TiledBg.prototype.cnds.OnURLLoaded, self);
		};
		if (url_.substr(0, 5) !== "data:" && crossOrigin_ === 0)
			img.crossOrigin = "anonymous";
		this.runtime.setImageSrc(img, url_);
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.ImageWidth = function (ret)
	{
		ret.set_float(this.texture_img.width);
	};
	Exps.prototype.ImageHeight = function (ret)
	{
		ret.set_float(this.texture_img.height);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.behaviors.Platform = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Platform.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	var ANIMMODE_STOPPED = 0;
	var ANIMMODE_MOVING = 1;
	var ANIMMODE_JUMPING = 2;
	var ANIMMODE_FALLING = 3;
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
		this.leftkey = false;
		this.rightkey = false;
		this.jumpkey = false;
		this.jumped = false;			// prevent bunnyhopping
		this.doubleJumped = false;
		this.canDoubleJump = false;
		this.ignoreInput = false;
		this.simleft = false;
		this.simright = false;
		this.simjump = false;
		this.lastFloorObject = null;
		this.loadFloorObject = -1;
		this.lastFloorX = 0;
		this.lastFloorY = 0;
		this.floorIsJumpthru = false;
		this.animMode = ANIMMODE_STOPPED;
		this.fallthrough = 0;			// fall through jump-thru.  >0 to disable, lasts a few ticks
		this.firstTick = true;
		this.dx = 0;
		this.dy = 0;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.updateGravity = function()
	{
		this.downx = Math.cos(this.ga);
		this.downy = Math.sin(this.ga);
		this.rightx = Math.cos(this.ga - Math.PI / 2);
		this.righty = Math.sin(this.ga - Math.PI / 2);
		this.downx = cr.round6dp(this.downx);
		this.downy = cr.round6dp(this.downy);
		this.rightx = cr.round6dp(this.rightx);
		this.righty = cr.round6dp(this.righty);
		this.g1 = this.g;
		if (this.g < 0)
		{
			this.downx *= -1;
			this.downy *= -1;
			this.g = Math.abs(this.g);
		}
	};
	behinstProto.onCreate = function()
	{
		this.maxspeed = this.properties[0];
		this.acc = this.properties[1];
		this.dec = this.properties[2];
		this.jumpStrength = this.properties[3];
		this.g = this.properties[4];
		this.g1 = this.g;
		this.maxFall = this.properties[5];
		this.enableDoubleJump = (this.properties[6] !== 0);	// 0=disabled, 1=enabled
		this.jumpSustain = (this.properties[7] / 1000);		// convert ms to s
		this.defaultControls = (this.properties[8] === 1);	// 0=no, 1=yes
		this.enabled = (this.properties[9] !== 0);
		this.wasOnFloor = false;
		this.wasOverJumpthru = this.runtime.testOverlapJumpThru(this.inst);
		this.loadOverJumpthru = -1;
		this.sustainTime = 0;				// time of jump sustain remaining
		this.ga = cr.to_radians(90);
		this.updateGravity();
		var self = this;
		if (this.defaultControls && !this.runtime.isDomFree)
		{
			jQuery(document).keydown(function(info) {
						self.onKeyDown(info);
					});
			jQuery(document).keyup(function(info) {
						self.onKeyUp(info);
					});
		}
		if (!this.recycled)
		{
			this.myDestroyCallback = function(inst) {
										self.onInstanceDestroyed(inst);
									};
		}
		this.runtime.addDestroyCallback(this.myDestroyCallback);
		this.inst.extra["isPlatformBehavior"] = true;
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"ii": this.ignoreInput,
			"lfx": this.lastFloorX,
			"lfy": this.lastFloorY,
			"lfo": (this.lastFloorObject ? this.lastFloorObject.uid : -1),
			"am": this.animMode,
			"en": this.enabled,
			"fall": this.fallthrough,
			"ft": this.firstTick,
			"dx": this.dx,
			"dy": this.dy,
			"ms": this.maxspeed,
			"acc": this.acc,
			"dec": this.dec,
			"js": this.jumpStrength,
			"g": this.g,
			"g1": this.g1,
			"mf": this.maxFall,
			"wof": this.wasOnFloor,
			"woj": (this.wasOverJumpthru ? this.wasOverJumpthru.uid : -1),
			"ga": this.ga,
			"edj": this.enableDoubleJump,
			"cdj": this.canDoubleJump,
			"dj": this.doubleJumped,
			"sus": this.jumpSustain
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.ignoreInput = o["ii"];
		this.lastFloorX = o["lfx"];
		this.lastFloorY = o["lfy"];
		this.loadFloorObject = o["lfo"];
		this.animMode = o["am"];
		this.enabled = o["en"];
		this.fallthrough = o["fall"];
		this.firstTick = o["ft"];
		this.dx = o["dx"];
		this.dy = o["dy"];
		this.maxspeed = o["ms"];
		this.acc = o["acc"];
		this.dec = o["dec"];
		this.jumpStrength = o["js"];
		this.g = o["g"];
		this.g1 = o["g1"];
		this.maxFall = o["mf"];
		this.wasOnFloor = o["wof"];
		this.loadOverJumpthru = o["woj"];
		this.ga = o["ga"];
		this.enableDoubleJump = o["edj"];
		this.canDoubleJump = o["cdj"];
		this.doubleJumped = o["dj"];
		this.jumpSustain = o["sus"];
		this.leftkey = false;
		this.rightkey = false;
		this.jumpkey = false;
		this.jumped = false;
		this.simleft = false;
		this.simright = false;
		this.simjump = false;
		this.sustainTime = 0;
		this.updateGravity();
	};
	behinstProto.afterLoad = function ()
	{
		if (this.loadFloorObject === -1)
			this.lastFloorObject = null;
		else
			this.lastFloorObject = this.runtime.getObjectByUID(this.loadFloorObject);
		if (this.loadOverJumpthru === -1)
			this.wasOverJumpthru = null;
		else
			this.wasOverJumpthru = this.runtime.getObjectByUID(this.loadOverJumpthru);
	};
	behinstProto.onInstanceDestroyed = function (inst)
	{
		if (this.lastFloorObject == inst)
			this.lastFloorObject = null;
	};
	behinstProto.onDestroy = function ()
	{
		this.lastFloorObject = null;
		this.runtime.removeDestroyCallback(this.myDestroyCallback);
	};
	behinstProto.onKeyDown = function (info)
	{
		switch (info.which) {
		case 38:	// up
			info.preventDefault();
			this.jumpkey = true;
			break;
		case 37:	// left
			info.preventDefault();
			this.leftkey = true;
			break;
		case 39:	// right
			info.preventDefault();
			this.rightkey = true;
			break;
		}
	};
	behinstProto.onKeyUp = function (info)
	{
		switch (info.which) {
		case 38:	// up
			info.preventDefault();
			this.jumpkey = false;
			this.jumped = false;
			break;
		case 37:	// left
			info.preventDefault();
			this.leftkey = false;
			break;
		case 39:	// right
			info.preventDefault();
			this.rightkey = false;
			break;
		}
	};
	behinstProto.onWindowBlur = function ()
	{
		this.leftkey = false;
		this.rightkey = false;
		this.jumpkey = false;
	};
	behinstProto.getGDir = function ()
	{
		if (this.g < 0)
			return -1;
		else
			return 1;
	};
	behinstProto.isOnFloor = function ()
	{
		var ret = null;
		var ret2 = null;
		var i, len, j;
		var oldx = this.inst.x;
		var oldy = this.inst.y;
		this.inst.x += this.downx;
		this.inst.y += this.downy;
		this.inst.set_bbox_changed();
		if (this.lastFloorObject && this.runtime.testOverlap(this.inst, this.lastFloorObject) &&
			(!this.runtime.typeHasBehavior(this.lastFloorObject.type, cr.behaviors.solid) || this.lastFloorObject.extra["solidEnabled"]))
		{
			this.inst.x = oldx;
			this.inst.y = oldy;
			this.inst.set_bbox_changed();
			return this.lastFloorObject;
		}
		else
		{
			ret = this.runtime.testOverlapSolid(this.inst);
			if (!ret && this.fallthrough === 0)
				ret2 = this.runtime.testOverlapJumpThru(this.inst, true);
			this.inst.x = oldx;
			this.inst.y = oldy;
			this.inst.set_bbox_changed();
			if (ret)		// was overlapping solid
			{
				if (this.runtime.testOverlap(this.inst, ret))
					return null;
				else
				{
					this.floorIsJumpthru = false;
					return ret;
				}
			}
			if (ret2 && ret2.length)
			{
				for (i = 0, j = 0, len = ret2.length; i < len; i++)
				{
					ret2[j] = ret2[i];
					if (!this.runtime.testOverlap(this.inst, ret2[i]))
						j++;
				}
				if (j >= 1)
				{
					this.floorIsJumpthru = true;
					return ret2[0];
				}
			}
			return null;
		}
	};
	behinstProto.tick = function ()
	{
	};
	behinstProto.posttick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		var mx, my, obstacle, mag, allover, i, len, j, oldx, oldy;
		if (!this.jumpkey && !this.simjump)
			this.jumped = false;
		var left = this.leftkey || this.simleft;
		var right = this.rightkey || this.simright;
		var jumpkey = (this.jumpkey || this.simjump);
		var jump = jumpkey && !this.jumped;
		this.simleft = false;
		this.simright = false;
		this.simjump = false;
		if (!this.enabled)
			return;
		if (this.ignoreInput)
		{
			left = false;
			right = false;
			jumpkey = false;
			jump = false;
		}
		if (!jumpkey)
			this.sustainTime = 0;
		var lastFloor = this.lastFloorObject;
		var floor_moved = false;
		if (this.firstTick)
		{
			if (this.runtime.testOverlapSolid(this.inst) || this.runtime.testOverlapJumpThru(this.inst))
			{
				this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, 4, true);
			}
			this.firstTick = false;
		}
		if (lastFloor && this.dy === 0 && (lastFloor.y !== this.lastFloorY || lastFloor.x !== this.lastFloorX))
		{
			mx = (lastFloor.x - this.lastFloorX);
			my = (lastFloor.y - this.lastFloorY);
			this.inst.x += mx;
			this.inst.y += my;
			this.inst.set_bbox_changed();
			this.lastFloorX = lastFloor.x;
			this.lastFloorY = lastFloor.y;
			floor_moved = true;
			if (this.runtime.testOverlapSolid(this.inst))
			{
				this.runtime.pushOutSolid(this.inst, -mx, -my, Math.sqrt(mx * mx + my * my) * 2.5);
			}
		}
		var floor_ = this.isOnFloor();
		var collobj = this.runtime.testOverlapSolid(this.inst);
		if (collobj)
		{
			if (this.inst.extra["inputPredicted"])
			{
				this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, 10, false);
			}
			else if (this.runtime.pushOutSolidAxis(this.inst, this.rightx, this.righty, this.inst.width / 2))
			{
				this.runtime.registerCollision(this.inst, collobj);
			}
			else if (this.runtime.pushOutSolidNearest(this.inst, Math.max(this.inst.width, this.inst.height) / 2))
			{
				this.runtime.registerCollision(this.inst, collobj);
			}
			else
				return;
		}
		if (floor_)
		{
			this.doubleJumped = false;		// reset double jump flags for next jump
			this.canDoubleJump = false;
			if (this.dy > 0)
			{
				if (!this.wasOnFloor)
				{
					this.runtime.pushInFractional(this.inst, -this.downx, -this.downy, floor_, 16);
					this.wasOnFloor = true;
				}
				this.dy = 0;
			}
			if (lastFloor != floor_)
			{
				this.lastFloorObject = floor_;
				this.lastFloorX = floor_.x;
				this.lastFloorY = floor_.y;
				this.runtime.registerCollision(this.inst, floor_);
			}
			else if (floor_moved)
			{
				collobj = this.runtime.testOverlapSolid(this.inst);
				if (collobj)
				{
					this.runtime.registerCollision(this.inst, collobj);
					if (mx !== 0)
					{
						if (mx > 0)
							this.runtime.pushOutSolid(this.inst, -this.rightx, -this.righty);
						else
							this.runtime.pushOutSolid(this.inst, this.rightx, this.righty);
					}
					this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy);
				}
			}
		}
		else
		{
			if (!jumpkey)
				this.canDoubleJump = true;
		}
		if ((floor_ && jump) || (!floor_ && this.enableDoubleJump && jumpkey && this.canDoubleJump && !this.doubleJumped))
		{
			oldx = this.inst.x;
			oldy = this.inst.y;
			this.inst.x -= this.downx;
			this.inst.y -= this.downy;
			this.inst.set_bbox_changed();
			if (!this.runtime.testOverlapSolid(this.inst))
			{
				this.sustainTime = this.jumpSustain;
				this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnJump, this.inst);
				this.animMode = ANIMMODE_JUMPING;
				this.dy = -this.jumpStrength;
				jump = true;		// set in case is double jump
				if (floor_)
					this.jumped = true;
				else
					this.doubleJumped = true;
			}
			else
				jump = false;
			this.inst.x = oldx;
			this.inst.y = oldy;
			this.inst.set_bbox_changed();
		}
		if (!floor_)
		{
			if (jumpkey && this.sustainTime > 0)
			{
				this.dy = -this.jumpStrength;
				this.sustainTime -= dt;
			}
			else
			{
				this.lastFloorObject = null;
				this.dy += this.g * dt;
				if (this.dy > this.maxFall)
					this.dy = this.maxFall;
			}
			if (jump)
				this.jumped = true;
		}
		this.wasOnFloor = !!floor_;
		if (left == right)	// both up or both down
		{
			if (this.dx < 0)
			{
				this.dx += this.dec * dt;
				if (this.dx > 0)
					this.dx = 0;
			}
			else if (this.dx > 0)
			{
				this.dx -= this.dec * dt;
				if (this.dx < 0)
					this.dx = 0;
			}
		}
		if (left && !right)
		{
			if (this.dx > 0)
				this.dx -= (this.acc + this.dec) * dt;
			else
				this.dx -= this.acc * dt;
		}
		if (right && !left)
		{
			if (this.dx < 0)
				this.dx += (this.acc + this.dec) * dt;
			else
				this.dx += this.acc * dt;
		}
		if (this.dx > this.maxspeed)
			this.dx = this.maxspeed;
		else if (this.dx < -this.maxspeed)
			this.dx = -this.maxspeed;
		var landed = false;
		if (this.dx !== 0)
		{
			oldx = this.inst.x;
			oldy = this.inst.y;
			mx = this.dx * dt * this.rightx;
			my = this.dx * dt * this.righty;
			this.inst.x += this.rightx * (this.dx > 1 ? 1 : -1) - this.downx;
			this.inst.y += this.righty * (this.dx > 1 ? 1 : -1) - this.downy;
			this.inst.set_bbox_changed();
			var is_jumpthru = false;
			var slope_too_steep = this.runtime.testOverlapSolid(this.inst);
			/*
			if (!slope_too_steep && floor_)
			{
				slope_too_steep = this.runtime.testOverlapJumpThru(this.inst);
				is_jumpthru = true;
				if (slope_too_steep)
				{
					this.inst.x = oldx;
					this.inst.y = oldy;
					this.inst.set_bbox_changed();
					if (this.runtime.testOverlap(this.inst, slope_too_steep))
					{
						slope_too_steep = null;
						is_jumpthru = false;
					}
				}
			}
			*/
			this.inst.x = oldx + mx;
			this.inst.y = oldy + my;
			this.inst.set_bbox_changed();
			obstacle = this.runtime.testOverlapSolid(this.inst);
			if (!obstacle && floor_)
			{
				obstacle = this.runtime.testOverlapJumpThru(this.inst);
				if (obstacle)
				{
					this.inst.x = oldx;
					this.inst.y = oldy;
					this.inst.set_bbox_changed();
					if (this.runtime.testOverlap(this.inst, obstacle))
					{
						obstacle = null;
						is_jumpthru = false;
					}
					else
						is_jumpthru = true;
					this.inst.x = oldx + mx;
					this.inst.y = oldy + my;
					this.inst.set_bbox_changed();
				}
			}
			if (obstacle)
			{
				var push_dist = Math.abs(this.dx * dt) + 2;
				if (slope_too_steep || !this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, push_dist, is_jumpthru, obstacle))
				{
					this.runtime.registerCollision(this.inst, obstacle);
					push_dist = Math.max(Math.abs(this.dx * dt * 2.5), 30);
					if (!this.runtime.pushOutSolid(this.inst, this.rightx * (this.dx < 0 ? 1 : -1), this.righty * (this.dx < 0 ? 1 : -1), push_dist, false))
					{
						this.inst.x = oldx;
						this.inst.y = oldy;
						this.inst.set_bbox_changed();
					}
					else if (floor_ && !is_jumpthru && !this.floorIsJumpthru)
					{
						oldx = this.inst.x;
						oldy = this.inst.y;
						this.inst.x += this.downx;
						this.inst.y += this.downy;
						if (this.runtime.testOverlapSolid(this.inst))
						{
							if (!this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, 3, false))
							{
								this.inst.x = oldx;
								this.inst.y = oldy;
								this.inst.set_bbox_changed();
							}
						}
						else
						{
							this.inst.x = oldx;
							this.inst.y = oldy;
							this.inst.set_bbox_changed();
						}
					}
					if (!is_jumpthru)
						this.dx = 0;	// stop
				}
				else if (!slope_too_steep && !jump && (Math.abs(this.dy) < Math.abs(this.jumpStrength / 4)))
				{
					this.dy = 0;
					if (!floor_)
						landed = true;
				}
			}
			else
			{
				var newfloor = this.isOnFloor();
				if (floor_ && !newfloor)
				{
					mag = Math.ceil(Math.abs(this.dx * dt)) + 2;
					oldx = this.inst.x;
					oldy = this.inst.y;
					this.inst.x += this.downx * mag;
					this.inst.y += this.downy * mag;
					this.inst.set_bbox_changed();
					if (this.runtime.testOverlapSolid(this.inst) || this.runtime.testOverlapJumpThru(this.inst))
						this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, mag + 2, true);
					else
					{
						this.inst.x = oldx;
						this.inst.y = oldy;
						this.inst.set_bbox_changed();
					}
				}
				else if (newfloor && this.dy === 0)
				{
					this.runtime.pushInFractional(this.inst, -this.downx, -this.downy, newfloor, 16);
				}
			}
		}
		if (this.dy !== 0)
		{
			oldx = this.inst.x;
			oldy = this.inst.y;
			this.inst.x += this.dy * dt * this.downx;
			this.inst.y += this.dy * dt * this.downy;
			var newx = this.inst.x;
			var newy = this.inst.y;
			this.inst.set_bbox_changed();
			collobj = this.runtime.testOverlapSolid(this.inst);
			var fell_on_jumpthru = false;
			if (!collobj && (this.dy > 0) && !floor_)
			{
				allover = this.fallthrough > 0 ? null : this.runtime.testOverlapJumpThru(this.inst, true);
				if (allover && allover.length)
				{
					if (this.wasOverJumpthru)
					{
						this.inst.x = oldx;
						this.inst.y = oldy;
						this.inst.set_bbox_changed();
						for (i = 0, j = 0, len = allover.length; i < len; i++)
						{
							allover[j] = allover[i];
							if (!this.runtime.testOverlap(this.inst, allover[i]))
								j++;
						}
						allover.length = j;
						this.inst.x = newx;
						this.inst.y = newy;
						this.inst.set_bbox_changed();
					}
					if (allover.length >= 1)
						collobj = allover[0];
				}
				fell_on_jumpthru = !!collobj;
			}
			if (collobj)
			{
				this.runtime.registerCollision(this.inst, collobj);
				this.sustainTime = 0;
				var push_dist = (fell_on_jumpthru ? Math.abs(this.dy * dt * 2.5 + 10) : Math.max(Math.abs(this.dy * dt * 2.5 + 10), 30));
				if (!this.runtime.pushOutSolid(this.inst, this.downx * (this.dy < 0 ? 1 : -1), this.downy * (this.dy < 0 ? 1 : -1), push_dist, fell_on_jumpthru, collobj))
				{
					this.inst.x = oldx;
					this.inst.y = oldy;
					this.inst.set_bbox_changed();
					this.wasOnFloor = true;		// prevent adjustment for unexpected floor landings
					if (!fell_on_jumpthru)
						this.dy = 0;	// stop
				}
				else
				{
					this.lastFloorObject = collobj;
					this.lastFloorX = collobj.x;
					this.lastFloorY = collobj.y;
					this.floorIsJumpthru = fell_on_jumpthru;
					if (fell_on_jumpthru)
						landed = true;
					this.dy = 0;	// stop
				}
			}
		}
		if (this.animMode !== ANIMMODE_FALLING && this.dy > 0 && !floor_)
		{
			this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnFall, this.inst);
			this.animMode = ANIMMODE_FALLING;
		}
		if ((floor_ || landed) && this.dy >= 0)
		{
			if (this.animMode === ANIMMODE_FALLING || landed || (jump && this.dy === 0))
			{
				this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnLand, this.inst);
				if (this.dx === 0 && this.dy === 0)
					this.animMode = ANIMMODE_STOPPED;
				else
					this.animMode = ANIMMODE_MOVING;
			}
			else
			{
				if (this.animMode !== ANIMMODE_STOPPED && this.dx === 0 && this.dy === 0)
				{
					this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnStop, this.inst);
					this.animMode = ANIMMODE_STOPPED;
				}
				if (this.animMode !== ANIMMODE_MOVING && (this.dx !== 0 || this.dy !== 0) && !jump)
				{
					this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnMove, this.inst);
					this.animMode = ANIMMODE_MOVING;
				}
			}
		}
		if (this.fallthrough > 0)
			this.fallthrough--;
		this.wasOverJumpthru = this.runtime.testOverlapJumpThru(this.inst);
	};
	function Cnds() {};
	Cnds.prototype.IsMoving = function ()
	{
		return this.dx !== 0 || this.dy !== 0;
	};
	Cnds.prototype.CompareSpeed = function (cmp, s)
	{
		var speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
		return cr.do_cmp(speed, cmp, s);
	};
	Cnds.prototype.IsOnFloor = function ()
	{
		if (this.dy !== 0)
			return false;
		var ret = null;
		var ret2 = null;
		var i, len, j;
		var oldx = this.inst.x;
		var oldy = this.inst.y;
		this.inst.x += this.downx;
		this.inst.y += this.downy;
		this.inst.set_bbox_changed();
		ret = this.runtime.testOverlapSolid(this.inst);
		if (!ret && this.fallthrough === 0)
			ret2 = this.runtime.testOverlapJumpThru(this.inst, true);
		this.inst.x = oldx;
		this.inst.y = oldy;
		this.inst.set_bbox_changed();
		if (ret)		// was overlapping solid
		{
			return !this.runtime.testOverlap(this.inst, ret);
		}
		if (ret2 && ret2.length)
		{
			for (i = 0, j = 0, len = ret2.length; i < len; i++)
			{
				ret2[j] = ret2[i];
				if (!this.runtime.testOverlap(this.inst, ret2[i]))
					j++;
			}
			if (j >= 1)
				return true;
		}
		return false;
	};
	Cnds.prototype.IsByWall = function (side)
	{
		var ret = false;
		var oldx = this.inst.x;
		var oldy = this.inst.y;
		if (side === 0)		// left
		{
			this.inst.x -= this.rightx * 2;
			this.inst.y -= this.righty * 2;
		}
		else
		{
			this.inst.x += this.rightx * 2;
			this.inst.y += this.righty * 2;
		}
		this.inst.set_bbox_changed();
		if (!this.runtime.testOverlapSolid(this.inst))
		{
			this.inst.x = oldx;
			this.inst.y = oldy;
			this.inst.set_bbox_changed();
			return false;
		}
		this.inst.x -= this.downx * 3;
		this.inst.y -= this.downy * 3;
		this.inst.set_bbox_changed();
		ret = this.runtime.testOverlapSolid(this.inst);
		this.inst.x = oldx;
		this.inst.y = oldy;
		this.inst.set_bbox_changed();
		return ret;
	};
	Cnds.prototype.IsJumping = function ()
	{
		return this.dy < 0;
	};
	Cnds.prototype.IsFalling = function ()
	{
		return this.dy > 0;
	};
	Cnds.prototype.OnJump = function ()
	{
		return true;
	};
	Cnds.prototype.OnFall = function ()
	{
		return true;
	};
	Cnds.prototype.OnStop = function ()
	{
		return true;
	};
	Cnds.prototype.OnMove = function ()
	{
		return true;
	};
	Cnds.prototype.OnLand = function ()
	{
		return true;
	};
	Cnds.prototype.IsDoubleJumpEnabled = function ()
	{
		return this.enableDoubleJump;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetIgnoreInput = function (ignoring)
	{
		this.ignoreInput = ignoring;
	};
	Acts.prototype.SetMaxSpeed = function (maxspeed)
	{
		this.maxspeed = maxspeed;
		if (this.maxspeed < 0)
			this.maxspeed = 0;
	};
	Acts.prototype.SetAcceleration = function (acc)
	{
		this.acc = acc;
		if (this.acc < 0)
			this.acc = 0;
	};
	Acts.prototype.SetDeceleration = function (dec)
	{
		this.dec = dec;
		if (this.dec < 0)
			this.dec = 0;
	};
	Acts.prototype.SetJumpStrength = function (js)
	{
		this.jumpStrength = js;
		if (this.jumpStrength < 0)
			this.jumpStrength = 0;
	};
	Acts.prototype.SetGravity = function (grav)
	{
		if (this.g1 === grav)
			return;		// no change
		this.g = grav;
		this.updateGravity();
		if (this.runtime.testOverlapSolid(this.inst))
		{
			this.runtime.pushOutSolid(this.inst, this.downx, this.downy, 10);
			this.inst.x += this.downx * 2;
			this.inst.y += this.downy * 2;
			this.inst.set_bbox_changed();
		}
		this.lastFloorObject = null;
	};
	Acts.prototype.SetMaxFallSpeed = function (mfs)
	{
		this.maxFall = mfs;
		if (this.maxFall < 0)
			this.maxFall = 0;
	};
	Acts.prototype.SimulateControl = function (ctrl)
	{
		switch (ctrl) {
		case 0:		this.simleft = true;	break;
		case 1:		this.simright = true;	break;
		case 2:		this.simjump = true;	break;
		}
	};
	Acts.prototype.SetVectorX = function (vx)
	{
		this.dx = vx;
	};
	Acts.prototype.SetVectorY = function (vy)
	{
		this.dy = vy;
	};
	Acts.prototype.SetGravityAngle = function (a)
	{
		a = cr.to_radians(a);
		a = cr.clamp_angle(a);
		if (this.ga === a)
			return;		// no change
		this.ga = a;
		this.updateGravity();
		this.lastFloorObject = null;
	};
	Acts.prototype.SetEnabled = function (en)
	{
		if (this.enabled !== (en === 1))
		{
			this.enabled = (en === 1);
			if (!this.enabled)
				this.lastFloorObject = null;
		}
	};
	Acts.prototype.FallThrough = function ()
	{
		var oldx = this.inst.x;
		var oldy = this.inst.y;
		this.inst.x += this.downx;
		this.inst.y += this.downy;
		this.inst.set_bbox_changed();
		var overlaps = this.runtime.testOverlapJumpThru(this.inst, false);
		this.inst.x = oldx;
		this.inst.y = oldy;
		this.inst.set_bbox_changed();
		if (!overlaps)
			return;
		this.fallthrough = 3;			// disable jumpthrus for 3 ticks (1 doesn't do it, 2 does, 3 to be on safe side)
		this.lastFloorObject = null;
	};
	Acts.prototype.SetDoubleJumpEnabled = function (e)
	{
		this.enableDoubleJump = (e !== 0);
	};
	Acts.prototype.SetJumpSustain = function (s)
	{
		this.jumpSustain = s / 1000;		// convert to ms
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Speed = function (ret)
	{
		ret.set_float(Math.sqrt(this.dx * this.dx + this.dy * this.dy));
	};
	Exps.prototype.MaxSpeed = function (ret)
	{
		ret.set_float(this.maxspeed);
	};
	Exps.prototype.Acceleration = function (ret)
	{
		ret.set_float(this.acc);
	};
	Exps.prototype.Deceleration = function (ret)
	{
		ret.set_float(this.dec);
	};
	Exps.prototype.JumpStrength = function (ret)
	{
		ret.set_float(this.jumpStrength);
	};
	Exps.prototype.Gravity = function (ret)
	{
		ret.set_float(this.g);
	};
	Exps.prototype.GravityAngle = function (ret)
	{
		ret.set_float(cr.to_degrees(this.ga));
	};
	Exps.prototype.MaxFallSpeed = function (ret)
	{
		ret.set_float(this.maxFall);
	};
	Exps.prototype.MovingAngle = function (ret)
	{
		ret.set_float(cr.to_degrees(Math.atan2(this.dy, this.dx)));
	};
	Exps.prototype.VectorX = function (ret)
	{
		ret.set_float(this.dx);
	};
	Exps.prototype.VectorY = function (ret)
	{
		ret.set_float(this.dy);
	};
	Exps.prototype.JumpSustain = function (ret)
	{
		ret.set_float(this.jumpSustain * 1000);		// convert back to ms
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.Rotate = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Rotate.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.speed = cr.to_radians(this.properties[0]);
		this.acc = cr.to_radians(this.properties[1]);
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"speed": this.speed,
			"acc": this.acc
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.speed = o["speed"];
		this.acc = o["acc"];
	};
	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		if (dt === 0)
			return;
		if (this.acc !== 0)
			this.speed += this.acc * dt;
		if (this.speed !== 0)
		{
			this.inst.angle = cr.clamp_angle(this.inst.angle + this.speed * dt);
			this.inst.set_bbox_changed();
		}
	};
	function Cnds() {};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetSpeed = function (s)
	{
		this.speed = cr.to_radians(s);
	};
	Acts.prototype.SetAcceleration = function (a)
	{
		this.acc = cr.to_radians(a);
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Speed = function (ret)
	{
		ret.set_float(cr.to_degrees(this.speed));
	};
	Exps.prototype.Acceleration = function (ret)
	{
		ret.set_float(cr.to_degrees(this.acc));
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.custom = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.custom.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;
		this.runtime = type.runtime;
		this.dx = 0;
		this.dy = 0;
		this.cancelStep = 0;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.stepMode = this.properties[0];	// 0=None, 1=Linear, 2=Horizontal then vertical, 3=Vertical then horizontal
		this.pxPerStep = this.properties[1];
		this.enabled = (this.properties[2] !== 0);
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"dx": this.dx,
			"dy": this.dy,
			"cancelStep": this.cancelStep,
			"enabled": this.enabled,
			"stepMode": this.stepMode,
			"pxPerStep": this.pxPerStep
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.dx = o["dx"];
		this.dy = o["dy"];
		this.cancelStep = o["cancelStep"];
		this.enabled = o["enabled"];
		this.stepMode = o["stepMode"];
		this.pxPerStep = o["pxPerStep"];
	};
	behinstProto.getSpeed = function ()
	{
		return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
	};
	behinstProto.getAngle = function ()
	{
		return Math.atan2(this.dy, this.dx);
	};
	function sign(x)
	{
		if (x === 0)
			return 0;
		else if (x < 0)
			return -1;
		else
			return 1;
	};
	behinstProto.step = function (x, y, trigmethod)
	{
		if (x === 0 && y === 0)
			return;
		var startx = this.inst.x;
		var starty = this.inst.y;
		var sx, sy, prog;
		var steps = Math.round(Math.sqrt(x * x + y * y) / this.pxPerStep);
		if (steps === 0)
			steps = 1;
		var i;
		for (i = 1; i <= steps; i++)
		{
			prog = i / steps;
			this.inst.x = startx + x * prog;
			this.inst.y = starty + y * prog;
			this.inst.set_bbox_changed();
			this.runtime.trigger(trigmethod, this.inst);
			if (this.cancelStep === 1)
			{
				i--;
				prog = i / steps;
				this.inst.x = startx + x * prog;
				this.inst.y = starty + y * prog;
				this.inst.set_bbox_changed();
				return;
			}
			else if (this.cancelStep === 2)
			{
				return;
			}
		}
	};
	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		var mx = this.dx * dt;
		var my = this.dy * dt;
		var i, steps;
		if ((this.dx === 0 && this.dy === 0) || !this.enabled)
			return;
		this.cancelStep = 0;
		if (this.stepMode === 0)		// none
		{
			this.inst.x += mx;
			this.inst.y += my;
		}
		else if (this.stepMode === 1)	// linear
		{
			this.step(mx, my, cr.behaviors.custom.prototype.cnds.OnCMStep);
		}
		else if (this.stepMode === 2)	// horizontal then vertical
		{
			this.step(mx, 0, cr.behaviors.custom.prototype.cnds.OnCMHorizStep);
			this.cancelStep = 0;
			this.step(0, my, cr.behaviors.custom.prototype.cnds.OnCMVertStep);
		}
		else if (this.stepMode === 3)	// vertical then horizontal
		{
			this.step(0, my, cr.behaviors.custom.prototype.cnds.OnCMVertStep);
			this.cancelStep = 0;
			this.step(mx, 0, cr.behaviors.custom.prototype.cnds.OnCMHorizStep);
		}
		this.inst.set_bbox_changed();
	};
	function Cnds() {};
	Cnds.prototype.IsMoving = function ()
	{
		return this.dx != 0 || this.dy != 0;
	};
	Cnds.prototype.CompareSpeed = function (axis, cmp, s)
	{
		var speed;
		switch (axis) {
		case 0:		speed = this.getSpeed();	break;
		case 1:		speed = this.dx;			break;
		case 2:		speed = this.dy;			break;
		}
		return cr.do_cmp(speed, cmp, s);
	};
	Cnds.prototype.OnCMStep = function ()
	{
		return true;
	};
	Cnds.prototype.OnCMHorizStep = function ()
	{
		return true;
	};
	Cnds.prototype.OnCMVertStep = function ()
	{
		return true;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Stop = function ()
	{
		this.dx = 0;
		this.dy = 0;
	};
	Acts.prototype.Reverse = function (axis)
	{
		switch (axis) {
		case 0:
			this.dx *= -1;
			this.dy *= -1;
			break;
		case 1:
			this.dx *= -1;
			break;
		case 2:
			this.dy *= -1;
			break;
		}
	};
	Acts.prototype.SetSpeed = function (axis, s)
	{
		var a;
		switch (axis) {
		case 0:
			a = this.getAngle();
			this.dx = Math.cos(a) * s;
			this.dy = Math.sin(a) * s;
			break;
		case 1:
			this.dx = s;
			break;
		case 2:
			this.dy = s;
			break;
		}
	};
	Acts.prototype.Accelerate = function (axis, acc)
	{
		var dt = this.runtime.getDt(this.inst);
		var ds = acc * dt;
		var a;
		switch (axis) {
		case 0:
			a = this.getAngle();
			this.dx += Math.cos(a) * ds;
			this.dy += Math.sin(a) * ds;
			break;
		case 1:
			this.dx += ds;
			break;
		case 2:
			this.dy += ds;
			break;
		}
	};
	Acts.prototype.AccelerateAngle = function (acc, a_)
	{
		var dt = this.runtime.getDt(this.inst);
		var ds = acc * dt;
		var a = cr.to_radians(a_);
		this.dx += Math.cos(a) * ds;
		this.dy += Math.sin(a) * ds;
	};
	Acts.prototype.AcceleratePos = function (acc, x, y)
	{
		var dt = this.runtime.getDt(this.inst);
		var ds = acc * dt;
		var a = Math.atan2(y - this.inst.y, x - this.inst.x);
		this.dx += Math.cos(a) * ds;
		this.dy += Math.sin(a) * ds;
	};
	Acts.prototype.SetAngleOfMotion = function (a_)
	{
		var a = cr.to_radians(a_);
		var s = this.getSpeed();
		this.dx = Math.cos(a) * s;
		this.dy = Math.sin(a) * s;
	};
	Acts.prototype.RotateAngleOfMotionClockwise = function (a_)
	{
		var a = this.getAngle() + cr.to_radians(a_);
		var s = this.getSpeed();
		this.dx = Math.cos(a) * s;
		this.dy = Math.sin(a) * s;
	};
	Acts.prototype.RotateAngleOfMotionCounterClockwise = function (a_)
	{
		var a = this.getAngle() - cr.to_radians(a_);
		var s = this.getSpeed();
		this.dx = Math.cos(a) * s;
		this.dy = Math.sin(a) * s;
	};
	Acts.prototype.StopStepping = function (mode)
	{
		this.cancelStep = mode + 1;
	};
	Acts.prototype.PushOutSolid = function (mode)
	{
		var a, ux, uy;
		switch (mode) {
		case 0:
			a = this.getAngle();
			ux = Math.cos(a);
			uy = Math.sin(a);
			this.runtime.pushOutSolid(this.inst, -ux, -uy, Math.max(this.getSpeed() * 3, 100));
			break;
		case 1:
			this.runtime.pushOutSolidNearest(this.inst);
			break;
		case 2:
			this.runtime.pushOutSolid(this.inst, 0, -1, Math.max(Math.abs(this.dy) * 3, 100));
			break;
		case 3:
			this.runtime.pushOutSolid(this.inst, 0, 1, Math.max(Math.abs(this.dy) * 3, 100));
			break;
		case 4:
			this.runtime.pushOutSolid(this.inst, -1, 0, Math.max(Math.abs(this.dx) * 3, 100));
			break;
		case 5:
			this.runtime.pushOutSolid(this.inst, 1, 0, Math.max(Math.abs(this.dx) * 3, 100));
			break;
		}
	};
	Acts.prototype.PushOutSolidAngle = function (a)
	{
		a = cr.to_radians(a);
		var ux = Math.cos(a);
		var uy = Math.sin(a);
		this.runtime.pushOutSolid(this.inst, ux, uy, Math.max(this.getSpeed() * 3, 100));
	};
	Acts.prototype.SetEnabled = function (en)
	{
		this.enabled = (en === 1);
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Speed = function (ret)
	{
		ret.set_float(this.getSpeed());
	};
	Exps.prototype.MovingAngle = function (ret)
	{
		ret.set_float(cr.to_degrees(this.getAngle()));
	};
	Exps.prototype.dx = function (ret)
	{
		ret.set_float(this.dx);
	};
	Exps.prototype.dy = function (ret)
	{
		ret.set_float(this.dy);
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.destroy = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.destroy.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
	};
	behinstProto.tick = function ()
	{
		this.inst.update_bbox();
		var bbox = this.inst.bbox;
		var layout = this.inst.layer.layout;
		if (bbox.right < 0 || bbox.bottom < 0 || bbox.left > layout.width || bbox.top > layout.height)
			this.runtime.DestroyInstance(this.inst);
	};
}());
;
;
cr.behaviors.solid = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.solid.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.inst.extra["solidEnabled"] = (this.properties[0] !== 0);
	};
	behinstProto.tick = function ()
	{
	};
	function Cnds() {};
	Cnds.prototype.IsEnabled = function ()
	{
		return this.inst.extra["solidEnabled"];
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetEnabled = function (e)
	{
		this.inst.extra["solidEnabled"] = !!e;
	};
	behaviorProto.acts = new Acts();
}());
cr.getObjectRefTable = function () { return [
	cr.plugins_.Keyboard,
	cr.plugins_.Mouse,
	cr.plugins_.Particles,
	cr.plugins_.Sprite,
	cr.plugins_.Text,
	cr.plugins_.TiledBg,
	cr.behaviors.Platform,
	cr.behaviors.solid,
	cr.behaviors.custom,
	cr.behaviors.Rotate,
	cr.behaviors.destroy,
	cr.plugins_.Keyboard.prototype.cnds.IsKeyDown,
	cr.behaviors.Platform.prototype.acts.SimulateControl,
	cr.plugins_.Sprite.prototype.cnds.OnCreated,
	cr.behaviors.custom.prototype.acts.SetSpeed,
	cr.behaviors.custom.prototype.acts.SetAngleOfMotion,
	cr.plugins_.Sprite.prototype.cnds.OnCollision,
	cr.behaviors.custom.prototype.acts.Reverse,
	cr.plugins_.Sprite.prototype.acts.Destroy,
	cr.system_object.prototype.acts.AddVar,
	cr.plugins_.Sprite.prototype.cnds.OnDestroyed,
	cr.plugins_.TiledBg.prototype.acts.SetPos,
	cr.plugins_.Text.prototype.acts.SetPos,
	cr.plugins_.Sprite.prototype.acts.SetPos,
	cr.plugins_.Sprite.prototype.acts.SetVisible,
	cr.system_object.prototype.acts.SetTimescale,
	cr.plugins_.Text.prototype.acts.SetText,
	cr.system_object.prototype.cnds.OnLayoutStart,
	cr.plugins_.Mouse.prototype.cnds.OnObjectClicked,
	cr.system_object.prototype.acts.ResetGlobals,
	cr.system_object.prototype.acts.RestartLayout,
	cr.system_object.prototype.acts.GoToLayout,
	cr.system_object.prototype.cnds.CompareVar
];};

