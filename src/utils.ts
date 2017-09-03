interface Array<T> {
  remove(element: T);
  contains(selector: (value: any) => boolean);
  any();
  groupBy(key, filter?);
  page(page, pageSize?);
  insert(index: number, item: any);
}

interface String {
  truncate(n: number);
}

interface Object {
  values(obj: Object);
}

interface Dictionary<T> {
  [key: string]: T;
}

Object.values = obj => {
  return Object.keys(obj).map(k => obj[k]);
}

Array.prototype.contains = function (selector: (value: any) => boolean) {
  return this.filter(selector).length > 0;
}

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

Array.prototype.remove = function (element) {
  var toRemove = this.findIndex(e => e === element);
  this.splice(toRemove, 1);
};

Array.prototype.page = function (page, pageSize = 15) {
 return this.slice((page - 1) * pageSize, page * pageSize);
};

Array.prototype.any = function () {
  return this.length > 0;
};

Array.prototype.groupBy = function (key, filter: (any) => any = null) {
  return this.reduce(function (rv, x) {
      let keyVal = filter == null ? x[key] : filter(x[key]);
      (rv[keyVal] = rv[keyVal] || []).push(x);
      return rv;
  }, {});
};

String.prototype.truncate = function(n) {
  let isTooLong = this.length > n,
      s = isTooLong ? this.substr(0, n - 1) : this;
  s = (isTooLong) ? s.substr(0, s.lastIndexOf(' ')) : s;
  return s;
};

class Conversions {
  static PhoneNumber(raw) {
      if (!raw) { return raw; }
      var m = raw.match(/^(\d{3})(\d{3})(\d{4})(x\d{0,5})?$/);
      if (!m || m.length < 5) { return raw; }
      return `${m[1]}-${m[2]}-${m[3]}${m[4] || ''}`;
  }
  static SocialSecurityNumber(raw) {
      if (!raw || raw.length !== 9) { return raw; }
      var m = raw.match(/^(\d{3})(\d{2})(\d{4})$/);
      if (!m || m.length < 4) { return raw; }
      return `${m[1]}-${m[2]}-${m[3]}`;
  }
}
