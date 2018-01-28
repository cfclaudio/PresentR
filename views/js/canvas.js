// FREE DRAWING
    // Place script tags at the bottom of the page.
    // That way progressive page rendering and
    // downloads are not blocked.
    // Run only when HTML is loaded and
    // DOM properly initialized (courtesy jquery)
        var $ = function(id){return document.getElementById(id)};
        var canvas = this.__canvas = new fabric.Canvas('c', {
            isDrawingMode: false, width:900, height:600
        });
        fabric.Object.prototype.transparentCorners = false;

        var drawingModeEl = $('drawing-mode'),
            textModeEl = $('text-mode'),
            insertingTextEL = $('insert-text'),
            textOptionsEl = $('text-mode-options'),
            drawingOptionsEl = $('drawing-mode-options'),
            drawingColorEl = $('drawing-color'),
            drawingShadowColorEl = $('drawing-shadow-color'),
            drawingLineWidthEl = $('drawing-line-width'),
            drawingShadowWidth = $('drawing-shadow-width'),
            drawingShadowOffset = $('drawing-shadow-offset'),
            clearEl = $('clear-canvas'),
            deleteObjectsEl = $('delete-objects'),
            textValue = $('text-value'),
            savingImgEl = $('save-canvas'),
            addShapeOptionsEL = $('add-shape-options');

        var isTextMode = false;

        clearEl.onclick = function() { canvas.clear() };
        deleteObjectsEl.onclick = function() {
            var activeObject = canvas.getActiveObject(),
                activeGroup = canvas.getActiveGroup();
            if (activeObject) { canvas.remove(activeObject); }
            else if (activeGroup) {
                var objectsInGroup = activeGroup.getObjects();
                canvas.discardActiveGroup();
                objectsInGroup.forEach(function(object) {
                canvas.remove(object);
                });
            }
        };
        drawingModeEl.onclick = function() {
            if (!isTextMode) { canvas.isDrawingMode = !canvas.isDrawingMode; }
            if (canvas.isDrawingMode) {
                drawingModeEl.innerHTML = 'Cancel drawing mode';
                drawingOptionsEl.style.display = '';
            } else {
                drawingModeEl.innerHTML = 'Enter drawing mode';
                drawingOptionsEl.style.display = 'none';
            }
        };

        textModeEl.onclick = function(){
            if (!canvas.isDrawingMode) { isTextMode = !isTextMode; }
            if (isTextMode) {
                textModeEl.innerHTML = 'Cancel text mode';
                textOptionsEl.style.display = '';
            } else {
                textModeEl.innerHTML = 'Enter text mode';
                textOptionsEl.style.display = 'none';
            }
        };

        insertingTextEL.onclick = function() {
            var text = new fabric.IText(textValue.value, { left: 100, top: 100 });
            text.fill = drawingColorEl.value;
            canvas.add(text);
        };
        if (fabric.PatternBrush) {
            var vLinePatternBrush = new fabric.PatternBrush(canvas);
            vLinePatternBrush.getPatternSrc = function() {
                var patternCanvas = fabric.document.createElement('canvas');
                patternCanvas.width = patternCanvas.height = 10;
                var ctx = patternCanvas.getContext('2d');
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(0, 5);
                ctx.lineTo(10, 5);
                ctx.closePath();
                ctx.stroke();
                return patternCanvas;
            };
            var hLinePatternBrush = new fabric.PatternBrush(canvas);
            hLinePatternBrush.getPatternSrc = function() {
                var patternCanvas = fabric.document.createElement('canvas');
                patternCanvas.width = patternCanvas.height = 10;
                var ctx = patternCanvas.getContext('2d');
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(5, 0);
                ctx.lineTo(5, 10);
                ctx.closePath();
                ctx.stroke();
                return patternCanvas;
            };
            var squarePatternBrush = new fabric.PatternBrush(canvas);
            squarePatternBrush.getPatternSrc = function() {
                var squareWidth = 10, squareDistance = 2;
                var patternCanvas = fabric.document.createElement('canvas');
                patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
                var ctx = patternCanvas.getContext('2d');
                ctx.fillStyle = this.color;
                ctx.fillRect(0, 0, squareWidth, squareWidth);
                return patternCanvas;
            };
            var diamondPatternBrush = new fabric.PatternBrush(canvas);
            diamondPatternBrush.getPatternSrc = function() {
                var squareWidth = 10, squareDistance = 5;
                var patternCanvas = fabric.document.createElement('canvas');
                var rect = new fabric.Rect({
                    width: squareWidth,
                    height: squareWidth,
                    angle: 45,
                    fill: this.color
                });
                var canvasWidth = rect.getBoundingRect().width;
                patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
                rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });
                var ctx = patternCanvas.getContext('2d');
                rect.render(ctx);
                return patternCanvas;
            };
            var img = new Image();
            img.src = 'empty.png';
            var texturePatternBrush = new fabric.PatternBrush(canvas);
            texturePatternBrush.source = img;
        }
      $('shape-selector').onchange = function() {
        if (this.value === 'cir') {
          var circle = new fabric.Circle( {
              radius: 20,
              fill: drawingColorEl.value,
              left: 100,
              top: 100
            });
            canvas.add(circle);
        }  else if (this.value === 'rect') {
            var rect = new fabric.Rect( {
            width: 50,
            height: 30,
            fill: drawingColorEl.value,
            left: 100,
            top: 100
          });
          canvas.add(rect);
        }
      };
      $('drawing-mode-selector').onchange = function() {
        if (this.value === 'hline') {
          canvas.freeDrawingBrush = vLinePatternBrush;
        }
        else if (this.value === 'vline') {
          canvas.freeDrawingBrush = hLinePatternBrush;
        }
        else if (this.value === 'square') {
          canvas.freeDrawingBrush = squarePatternBrush;
        }
        else if (this.value === 'diamond') {
          canvas.freeDrawingBrush = diamondPatternBrush;
        }
        else if (this.value === 'texture') {
          canvas.freeDrawingBrush = texturePatternBrush;
        }
        else {
          canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
        }
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = drawingColorEl.value;
          canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
          canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            blur: parseInt(drawingShadowWidth.value, 10) || 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: true,
            color: drawingShadowColorEl.value,
          });
        }
      };
      drawingColorEl.onchange = function() {
        canvas.freeDrawingBrush.color = this.value;
      };
      drawingShadowColorEl.onchange = function() {
        canvas.freeDrawingBrush.shadow.color = this.value;
      };
      drawingLineWidthEl.onchange = function() {
        canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
        this.previousSibling.innerHTML = this.value;
      };
      drawingShadowWidth.onchange = function() {
        canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
      };
      drawingShadowOffset.onchange = function() {
        canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
        canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
      };
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = drawingColorEl.value;
        canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
          blur: parseInt(drawingShadowWidth.value, 10) || 0,
          offsetX: 0,
          offsetY: 0,
          affectStroke: true,
          color: drawingShadowColorEl.value,
        });
      }
      function download() {
        var dt = canvas.toDataURL('image/jpeg');
        this.href = dt;
      };
      downloadLnk.addEventListener('click', download, false);
      var imageLoader = document.getElementById('imageLoader');
      imageLoader.addEventListener('change', handleImage, false);
      var ctx = canvas.getContext('2d');
      function handleImage(e){
        var reader = new FileReader();
        reader.onload = function(event){
            var img = new Image();
            img.onload = function(){
                // ctx.drawImage(img,0,0);
                var imgInstance = new fabric.Image(img, {
                  left: 100,
                  top: 100,
                  angle: 30,
                  opacity: 0.85
                });
                canvas.add(imgInstance);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    };