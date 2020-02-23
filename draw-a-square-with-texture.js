
// 把材质坐标传给片段着色器
var vertexShaderSource = `
  attribute vec3 a_Pos;
  attribute vec2 tex_Coord;
  varying highp vec2 f_tex_Coord;
  void main() {
    f_tex_Coord = tex_Coord;
    gl_Position = vec4(a_Pos.x, a_Pos.y, a_Pos.z, 1.0);
  }
`;

// 通过材质插值得到颜色
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
  // vertex          // texture coords
  -0.5, 0.5, 0.0,    0.0, 1.0,
  0.5, 0.5, 0.0,     1.0, 1.0,
  -0.5, -0.5, 0.0,   0.0, 0.0,
  0.5, -0.5, 0.0,    1.0, 0.0,
];
var indics = [
  0, 1, 2,
  2, 1, 3,
];

var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertics), gl.STATIC_DRAW);

var indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indics), gl.STATIC_DRAW);

// 使用程序
gl.useProgram(program);

// 把材质绑定到第0个单元
var samplerLocation = gl.getUniformLocation(program, "u_Texture");
gl.uniform1i(samplerLocation, 0);


var aPosLocation = gl.getAttribLocation(program, "a_Pos");
gl.vertexAttribPointer(aPosLocation, 3, gl.FLOAT, false, 4 * 5, 0);
gl.enableVertexAttribArray(aPosLocation);

var texCoordLocation = gl.getAttribLocation(program, "tex_Coord");
gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 4 * 5, 4 * 3);
gl.enableVertexAttribArray(texCoordLocation);

setInterval(() => {
  // 用黑色背景填充屏幕
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 画一个正方形
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}, 1000);




