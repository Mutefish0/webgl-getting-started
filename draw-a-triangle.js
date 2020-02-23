// 顶点着色器源代码，坐标不变
// 齐次向量w为1.0（w用于“透视除法”，即x、y、x分别处以w，这个操作会在顶点着色器最后阶段自动执行）
var vertexShaderSource = `
  attribute vec3 a_Pos;
  void main() {
    gl_Position = vec4(a_Pos.x, a_Pos.y, a_Pos.z, 1.0);
  }
`;

// 片段着色器源代码，固定输出绿色
var fragShaderSource = `
  void main() {
    gl_FragColor = vec4(0.0, 0.5, 0.0, 1.0);
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


// 创建一块buffer内存来存储数据
var vertexbuffer = gl.createBuffer();
// 把gl.ARRAY_BUFFER绑定到vertexbuffer
gl.bindBuffer(gl.ARRAY_BUFFER, vertexbuffer);
// 把顶点数据送进buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -0.0, 0.5, 0.0,
  -0.5, -0.5, 0.0,
  0.5, -0.5, 0.0
]), gl.STATIC_DRAW);

// 使用程序
gl.useProgram(program);

var aPosLocation = gl.getAttribLocation(program, "a_Pos");
// 属性为“a_Pos”，分量为3，类型FLOAT（4个字节）,不归一化，间隔0个字节，偏移0字节
gl.vertexAttribPointer(aPosLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosLocation);


// 用黑色背景填充屏幕
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
// 画三角形
gl.drawArrays(gl.TRIANGLES, 0, 3);



