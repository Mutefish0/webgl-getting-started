
// 顶点着色器
var vertexShaderSource = `
  attribute vec3 a_Pos;
  attribute vec2 tex_Coord;
  uniform mat4 translation;
  uniform mat4 rotation_x;
  uniform mat4 rotation_y;
  uniform mat4 projection;
  varying highp vec2 f_tex_Coord;
  void main() {
    f_tex_Coord = tex_Coord;
    gl_Position = projection * translation * rotation_y * rotation_x * vec4(a_Pos, 1.0);
  }
`;

// 片段着色器
var fragShaderSource = `
  uniform sampler2D u_Texture;
  varying highp vec2 f_tex_Coord;
  void main() {
    gl_FragColor = texture2D(u_Texture, f_tex_Coord);
  }
`;

// 创建顶点着色器和片段着色器
var shader_vs = gl.createShader(gl.VERTEX_SHADER);
var shader_frag = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(shader_vs, vertexShaderSource);
gl.shaderSource(shader_frag, fragShaderSource);
// 编译着色器源代码
gl.compileShader(shader_vs);
gl.compileShader(shader_frag);
// 检查编译错误
if (!gl.getShaderParameter(shader_vs, gl.COMPILE_STATUS)) {
  throw new Error("顶点着色器编译出错");
}
if (!gl.getShaderParameter(shader_frag, gl.COMPILE_STATUS)) {
  throw new Error("片段着色器编译出错");
}
// 创建一个程序，并将顶点着色器和片段着色器链接到一起
var program = gl.createProgram();
gl.attachShader(program, shader_vs);
gl.attachShader(program, shader_frag);

var linkError = gl.linkProgram(program);
if (linkError) {
  throw new Error(linkError);
}

// 创建材质
var texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.activeTexture(gl.TEXTURE0);

// 图片不重复，采取编译拉伸的方式
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
// 图片缩放采用线性过滤
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
// 加载图片，并传送图片数据
var image = new Image();
image.onload = function () {
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
}
image.src = "./box.png";

var vertics = [
  // 前面
  -0.5, 0.5, -0.5,      0.0, 1.0,   
  0.5, 0.5, -0.5,       1.0, 1.0,
  -0.5, -0.5, -0.5,     0.0, 0.0,
  0.5, -0.5, -0.5,      1.0, 0.0,
  // 后面
  -0.5, 0.5, 0.5,      0.0, 1.0,
  0.5, 0.5, 0.5,       1.0, 1.0,
  -0.5, -0.5, 0.5,     0.0, 0.0,
  0.5, -0.5, 0.5,      1.0, 0.0,
  // 左面
  -0.5, -0.5, 0.5,      0.0, 1.0,
  -0.5, 0.5, 0.5,       1.0, 1.0,
  -0.5, -0.5, -0.5,     0.0, 0.0,
  -0.5, 0.5, -0.5,      1.0, 0.0,
  // 右面
  0.5, -0.5, 0.5,      0.0, 1.0,
  0.5, 0.5, 0.5,       1.0, 1.0,
  0.5, -0.5, -0.5,     0.0, 0.0,
  0.5, 0.5, -0.5,      1.0, 0.0,
  // 下面
  -0.5, -0.5, 0.5,     0.0, 1.0,
  0.5, -0.5, 0.5,      1.0, 1.0,
  -0.5, -0.5, -0.5,    0.0, 0.0,
  0.5, -0.5, -0.5,     1.0, 0.0,
  // 上面
  -0.5, 0.5, 0.5,      0.0, 1.0,
  0.5, 0.5, 0.5,       1.0, 1.0,
  -0.5, 0.5, -0.5,     0.0, 0.0,
  0.5, 0.5, -0.5,      1.0, 0.0,

];
var indics = [
  0, 1, 2,
  2, 1, 3,

  4, 5, 6,
  6, 5, 7,

  8, 9, 10,
  10, 9, 11,

  12, 13, 14,
  14, 13, 15,

  16, 17, 18,
  18, 17, 19,

  20, 21, 22,
  22, 21, 23,
];

var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertics), gl.STATIC_DRAW);

var indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indics), gl.STATIC_DRAW);

// 使用程序
gl.useProgram(program);

// 开启Z缓冲
gl.enable(gl.DEPTH_TEST);

// 把材质绑定到第0个单元
var samplerLocation = gl.getUniformLocation(program, "u_Texture");
gl.uniform1i(samplerLocation, 0);


var aPosLocation = gl.getAttribLocation(program, "a_Pos");
gl.vertexAttribPointer(aPosLocation, 3, gl.FLOAT, false, 4 * 5, 0);
gl.enableVertexAttribArray(aPosLocation);

var texCoordLocation = gl.getAttribLocation(program, "tex_Coord");
gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 4 * 5, 4 * 3);
gl.enableVertexAttribArray(texCoordLocation);

var translationLocation = gl.getUniformLocation(program, "translation");

var rotationXLocation = gl.getUniformLocation(program, "rotation_x");

var rotationYLocation = gl.getUniformLocation(program, "rotation_y");

var projectionLocation = gl.getUniformLocation(program, "projection");

// 平移变换
function setTranslate(dx, dy, dz) {
  gl.uniformMatrix4fv(translationLocation, false, [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    dx, dy, dz, 1,
  ]);
}

// 绕x轴旋转
function setRotateXDeg(rotateXDeg) {
  var rotateX = rotateXDeg / 180 * Math.PI;
  gl.uniformMatrix4fv(rotationXLocation, false, [
    1, 0, 0, 0,
    0, Math.cos(rotateX), -Math.sin(rotateX), 0,
    0, Math.sin(rotateX), Math.cos(rotateX), 0,
    0, 0, 0, 1
  ]);
}

// 绕y轴旋转
function setRotateYDeg(rotateYDeg) {
  var rotateY = rotateYDeg / 180 * Math.PI;
  gl.uniformMatrix4fv(rotationYLocation, false, [
    Math.cos(rotateY), 0, Math.sin(rotateY), 0,
    0, 1, 0, 0,
    -Math.sin(rotateY), 0, Math.cos(rotateY), 0,
    0, 0, 0, 1,
  ]);
}

// 透视变换
function setProjection(near, far, fov, aspectRatio) {
  var f = 1.0 / Math.tan(fov / 180 * Math.PI / 2);
  var rangeInv = 1 / (near - far);

  gl.uniformMatrix4fv(projectionLocation, false, [
    f / aspectRatio, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ]);
}

setTranslate(0, 0, -4);
setRotateXDeg(45);
setRotateYDeg(45);
setProjection(0.1, 50.0, 45, 0.75);

// 统计FPS
var frameCount = 0;
var fpsEl = document.getElementById("fps");
setInterval(function () {
  fpsEl.innerText = "FPS: " + frameCount;
  frameCount = 0;
}, 1000);

function frameStep() {
  // 用黑色背景填充屏幕
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 画一个立方体
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  frameCount += 1;
  window.requestAnimationFrame(frameStep);
}

// 旋转木箱
var r = 0;
setInterval(function () {
  r += 1;
  if (r == 360) {
    r = 0;
  }
  setRotateXDeg(r);
  setRotateYDeg(r);
}, 10);

window.requestAnimationFrame(frameStep);