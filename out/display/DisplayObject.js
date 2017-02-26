var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObject = (function () {
    function DisplayObject(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.localMat = MathUtil.identityMatrix(3);
        this.globalMat = MathUtil.identityMatrix(3);
        this.listeners = [];
    }
    Object.defineProperty(DisplayObject.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype.draw = function (context) {
        if (this.father)
            this.globalMat = this.localMat.multiply(this.father.globalMat);
        else
            this.globalMat = this.localMat;
        var m = this.globalMat.data;
        context.setTransform(m[0][0], m[1][0], m[0][1], m[1][1], m[0][2], m[1][2]);
        this.render(context);
    };
    DisplayObject.prototype.addEventListener = function (type, listener, capture, priority) {
        var event = new TouchListener(type, listener, capture, priority);
        this.listeners.push(event); //todo check listeners
    };
    DisplayObject.prototype.render = function (context) { };
    DisplayObject.prototype.rotate = function (eularDegree) {
        var mat = MathUtil.rotate2Mat(eularDegree);
        this.localMat = mat.multiply(this.localMat);
    };
    DisplayObject.prototype.transform = function (x, y) {
        var mat = MathUtil.move2Mat(x, y);
        this.localMat = mat.multiply(this.localMat);
    };
    DisplayObject.prototype.scale = function (x, y) {
        var mat = MathUtil.scale2Mat(x, y);
        this.localMat = mat.multiply(this.localMat);
    };
    DisplayObject.prototype.hitTest = function (event) {
        //矩阵逆变换
        var inverseMat = this.globalMat.inverse();
        var localClick = new MathUtil.Matrix(3, 1);
        localClick.data[0][0] = event.x;
        localClick.data[1][0] = event.y;
        localClick.data[2][0] = 1;
        localClick = inverseMat.multiply(localClick);
        var localClickX = localClick.a - this.x;
        var localClickY = localClick.b - this.y;
        if (0 < localClickX &&
            localClickX < this.width &&
            0 < localClickY &&
            localClickY < this.height) {
            return [this];
        }
        else
            return null;
    };
    DisplayObject.prototype.dispatchEvent = function (type, chain, event) {
        if (chain) {
            var transformedChain = chain.slice(0);
            if (type == "bubble") {
                transformedChain.reverse();
            }
            for (var i = 0; i < transformedChain.length; i++) {
                var element = transformedChain[i];
                element.listeners.forEach(function (value) {
                    var t = (type == "capture") ? value.capture : !value.capture;
                    if (value.type == event.type && t) {
                        //value.obj.func();todo更新func调用
                        value.func();
                    }
                });
            }
        }
        else
            console.log("no chain");
    };
    return DisplayObject;
}());
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(x, y, width, height) {
        _super.call(this, x, y, width, height);
        this._id = IDs.RECTANGLE_ID + Rectangle.count;
        Rectangle.count++;
    }
    Rectangle.prototype.render = function (context) {
        context.fillRect(this.x, this.y, this.width, this.height);
    };
    Rectangle.count = 0;
    return Rectangle;
}(DisplayObject));
var Picture = (function (_super) {
    __extends(Picture, _super);
    function Picture(x, y, img, width, height) {
        var image = new Image();
        image.src = img;
        _super.call(this, x, y, image.width, image.height);
        this.image = image;
        var self = this;
        this.image.onload = function () {
            self.width = image.width;
            self.height = image.height;
            console.log("width" + self.width + "height" + self.height);
        };
        this._id = IDs.PICTURE_ID + Picture.count;
        Picture.count++;
    }
    Picture.prototype.render = function (context) {
        var _this = this;
        context.drawImage(this.image, this.x, this.y);
        this.image.onload = function () {
            context.drawImage(_this.image, _this.x, _this.y);
        };
    };
    Picture.count = 0;
    return Picture;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField(x, y, str) {
        _super.call(this, x, y, str.length * 15, 20);
        this.str = str;
        //  this.size = size;
        this._id = IDs.TEXT_ID + TextField.count;
        TextField.count++;
    }
    TextField.prototype.render = function (context) {
        //  var font = this.context.font;
        // this.context.font = this.size + "px Verdana";
        context.fillText(this.str, this.x, this.y);
        //  this.context.font = font;
    };
    TextField.count = 0;
    return TextField;
}(DisplayObject));
//# sourceMappingURL=DisplayObject.js.map