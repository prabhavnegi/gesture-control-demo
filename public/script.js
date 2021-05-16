
const constraints = {
    video: {facingMode:'User',width: {min: 640}, height: {min: 480}}
};

const video = document.querySelector("video");
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const loader = document.getElementsByClassName('loader');
const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }});
 
hands.setOptions({
    maxNumHands: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

center = 0
const getC = (landmarks) => {
    x = landmarks[9].x * canvas.width
    y = landmarks[9].y * canvas.height
    distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y - 240,2) * 1.0)
    if (distance >= 220 && distance <= 420 && center == 0)
        center = 1
    if (distance > 420 && center == 1) {
        center = 0
        console.log('moving left')
        document.documentElement.scrollBy(0,-800)
    }
    else if (distance < 220 && center == 1 ) {
        center = 0
        console.log('moving right')
        document.documentElement.scrollBy(0,800)
    }
        
    ctx.fillStyle = 'green'
    ctx.fillRect(220, 240, 20, 20)
    ctx.fillRect(320, 240, 20, 20)
    ctx.fillRect(420, 240, 20, 20)
    ctx.beginPath()
    ctx.moveTo(0, 240)
    ctx.lineTo(x, y)
    ctx.stroke();

}


const onResult = (results) => {
    if (loader[0].style.display != 'none') {
        loader[0].style.display='none'
        document.querySelector('body').style.overflow = 'auto'
    }
    ctx.save()
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)
    if (!results.multiHandLandmarks && center) {
        center = 0
    }
    if(results.multiHandLandmarks) {
        getC(results.multiHandLandmarks[0])
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS,
                           {color: '#00FF00', lineWidth: 5});
            drawLandmarks(ctx, landmarks, {color: '#FF0000', lineWidth: 2});
          }
    }
    ctx.restore()
}  

hands.onResults(onResult)

const send = async () => {
    await hands.send({image:video})
    setTimeout(()=>{
        send()
    },10)
}


navigator.mediaDevices.getUserMedia(constraints).then(async (stream) => {
    video.srcObject = stream;
    send()
    })
