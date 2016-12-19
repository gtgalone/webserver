
function tick() {
  const element = (
    <div>
        <h1>현재시간</h1>
        <h1>{new Date().toLocaleTimeString()}</h1>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
