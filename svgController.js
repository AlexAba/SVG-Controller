var svgController = function () {
    var tapCache = [];
    var target;
    var viewBox;
    var ratio;
    var map;
    var focalPoint;
    var self = this;

    self.sens = 5;
    self.zoomFrom = 1.8;
    self.zoomTo = 3;

    self.Init = function (targ) {
        target = document.getElementById(targ);
        viewBox = target.getAttribute("viewBox").split(" ");
        ratio = +viewBox[3] / +viewBox[2];
        map = { width: +viewBox[2], height: +viewBox[3] };

        // Set min zoom;
        viewBox[2] = map.width / self.zoomFrom;
        viewBox[3] = +viewBox[2] * ratio;
        viewBox[0] = 310;
        viewBox[1] = 630;
        target.setAttribute("viewBox", viewBox);

        SetEvents();
    }

    function SetEvents() {
        target.ontouchstart = StartEvent;
        target.ontouchmove = MoveEvent;
        target.ontouchcancel = EndEvent;
        target.ontouchend = EndEvent;
        target.onwheel = Wheel;
    }

    function StartEvent(evt) {
        tapCache = [];

        for (var i = 0; i < evt.touches.length; i++) {
            tapCache.push(evt.touches[i]);
        }
        if (evt.touches.length == 2) {
            var focalX = Math.min(tapCache[0].clientX, tapCache[1].clientX) + (Math.abs((tapCache[0].clientX - tapCache[1].clientX) / 2));
            var focalY = Math.min(tapCache[0].clientY, tapCache[1].clientY) + (Math.abs((tapCache[0].clientY - tapCache[1].clientY) / 2));
            focalPoint = { x: focalX / window.innerWidth * viewBox[2] + +viewBox[0], y: focalY / window.innerHeight * viewBox[3] + +viewBox[1] };
        }
    }
    function MoveEvent(evt) {

        if (evt.touches.length == 1) {

            Move(evt);
        }
        else if (evt.touches.length == 2) {
            PinchZoom(evt);
        }

        CheckPosition();
        target.setAttribute("viewBox", viewBox);
    }
    function EndEvent(evt) {
        tapCache = [];
        focalPoint = null;
    }

    function Wheel(evt) {
        viewBox[2] = +viewBox[2] + evt.deltaY;

        if (map.width / viewBox[2] < self.zoomFrom)
            viewBox[2] = map.width / self.zoomFrom;
        else if (map.width / viewBox[2] > self.zoomTo)
            viewBox[2] = map.width / self.zoomTo;

        viewBox[3] = viewBox[2] * ratio;

        target.setAttribute("viewBox", viewBox);
    }
    function PinchZoom(evt) {
        var focalX = Math.min(tapCache[0].clientX, tapCache[1].clientX) + (Math.abs((tapCache[0].clientX - tapCache[1].clientX) / 2));
        var focalY = Math.min(tapCache[0].clientY, tapCache[1].clientY) + (Math.abs((tapCache[0].clientY - tapCache[1].clientY) / 2));
        
        var viewFocalPoint = { x: focalX / window.innerWidth * viewBox[2], y: focalY / window.innerHeight * viewBox[3]};

        var len1 = Magnitude({ x: tapCache[0].clientX, y: tapCache[0].clientY },
            { x: tapCache[1].clientX, y: tapCache[1].clientY });
        var len2 = Magnitude({ x: evt.touches[0].clientX, y: evt.touches[0].clientY },
            { x: evt.touches[1].clientX, y: evt.touches[1].clientY });

        var diff = len2 - len1;
        viewBox[2] = viewBox[2] - diff * self.sens


        if (map.width / +viewBox[2] < self.zoomFrom)
            viewBox[2] = map.width / self.zoomFrom;
        else if (map.width / +viewBox[2] > self.zoomTo)
            viewBox[2] = map.width / self.zoomTo;

        viewBox[3] = viewBox[2] * ratio;

        viewBox[0] = focalPoint.x - viewFocalPoint.x;
        viewBox[1] = focalPoint.y - viewFocalPoint.y;

        focalPoint.x = viewFocalPoint.x + +viewBox[0];
        focalPoint.y = viewFocalPoint.y + +viewBox[1];
        tapCache[0] = evt.touches[0];
        tapCache[1] = evt.touches[1];
    }
    function Move(evt) {
        var lenX = evt.touches[0].clientX - tapCache[0].clientX;
        var lenY = evt.touches[0].clientY - tapCache[0].clientY;

        viewBox[0] = viewBox[0] - lenX * self.sens;
        viewBox[1] = viewBox[1] - lenY * self.sens;

        tapCache[0] = evt.touches[0];
    }

    function Magnitude(point1, point2) {
        var ans = Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2))

        return ans;
    }
    function CheckPosition() {
        if (+viewBox[0] < 0)
            viewBox[0] = 0;
        else if (+viewBox[0] > (map.width - +viewBox[2]))
            viewBox[0] = map.width - +viewBox[2];

        if (+viewBox[1] < 0)
            viewBox[1] = 0;
        else if (+viewBox[1] > (map.height - +viewBox[3]))
            viewBox[1] = map.height - +viewBox[3];
    }
}