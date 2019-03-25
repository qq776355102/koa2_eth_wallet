var Queue = function (setcount) {
    this.list = [];//任务列表
    this.cur_nonce = 0;
    this.last_nonce = 0;
    if (setcount == 0 && typeof setcount != 'number') this.count = 50;
    this.count = 50;
    this.ps = false;
};
Queue.prototype = {
    clear: function () {
        this.list.length = 0;
        this.cur_nonce = 0;
        return this;
    },

    pause: function () {
        this.ps = true;
    },
    rec: function () {
        this.ps = false;
    },

    push: function (nonce) {
        this.list.push(nonce);
    },

    shift: function () {
        return this.list.sort().shift();
    },

    set_nonce: function (nonce) {
        if (this.list.length > this.count) {
            return this;
        };
        if (nonce) {
            this.cur_nonce = nonce;
        } else {
            if(this.cur_nonce){
                this.cur_nonce++;
            }else{
                this.list.length = 0;
            }
        };
        this.list.push(this.cur_nonce);
        return this;
    },

    get_nonce: function () {
        return this.cur_nonce;
    },
    get_taskcount: function () {
        return this.list.length;
    },
    get_first: function () {
        return this.list.sort()[0];
    }
};

var single = (function () {
    var unique;
    function getInstance(setcount) {
        if (unique === undefined) {
            unique = new Queue(setcount);
        }
        return unique;
    };
    return {
        getInstance: getInstance
    }
})();
module.exports = single;