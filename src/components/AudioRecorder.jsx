// Componente para grabar los mensajes del usuario
import React, { useState, useContext } from 'react';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import { audioTranscription, conversationUpdate } from './js/openai';
import { ContextoConversacion } from '../context/context';
import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";

const svg_microphone =<path xmlns="http://www.w3.org/2000/svg" d="M3.979 15.045c-1.468.978-2.168 2.263-2.231 3.955h-1.748c.069-2.346 1.1-4.186 3.153-5.497l.826 1.542zm15.36-12.045c1.468 0 2.661 1.194 2.661 2.662 0 1.115-.651 2.238-2.085 2.521l-2.366-4.417c.63-.662 1.268-.766 1.79-.766zm0-2c-1.852 0-3.198.966-4.138 2.619l3.545 6.618c3.4.222 5.254-2.149 5.254-4.575 0-2.598-2.098-4.662-4.661-4.662zm-3.722 7.631l-7.418 2.977 6.602-4.5-.949-1.772-9.38 6.393 1.557 2.906 10.539-4.229-.951-1.775zm-6.38 6.87c.633.619.764 1.648.764 2.558v4.941h1.999v-5.097c0-1.776.662-3.024 1.735-4.207l-4.498 1.805z"/>

const useConversacion = () => {
  return useContext(ContextoConversacion);
}

const AudioRecorder = () => {
  const {setTranscribiendo, setMensajes, createSystemMessage, agregarMensaje, json,setJson, typing,profesor,materia} = useConversacion();
  const [recordState, setRecordState] = useState(null);
  const [cancelado, setCancelado] = useState(false);

  const $canvas = document.querySelector('.audio-react-recorder>canvas');

  const start = () => {
    setCancelado(false);
    if($canvas){
      $canvas.style.display = 'block';
    }
    setRecordState(RecordState.START);
  };

  const stop = (parar) => {

    $canvas.style.display = 'none';
    setRecordState(RecordState.STOP);
    if(!parar){
      setTranscribiendo(true);
    }else{
      setCancelado(true);
    }
  };

  // audioData contains blob and blobUrl
  const onStop = (audioData) => {
    if(cancelado) return;
    audioTranscription(audioData.blob).then((res) => {
      conversationUpdate(agregarMensaje,res.text,setMensajes,createSystemMessage,json,setJson,profesor,materia);
      setTranscribiendo(false);
    });
  };

  // Manejar click del botón, dependiendo del estado del grabador
  const handleButton = () => {
    if (recordState === RecordState.START) {
      stop(false);
    } else {
      start();
    }
  };

  return (
    !typing ? (<div className='flex items-center'>
      <AudioReactRecorder state={recordState} onStop={onStop} canvasWidth={200} canvasHeight={50} />
      <Popover placement="top" showArrow>
        <PopoverTrigger>
          <Button onClick={handleButton} className='flex items-center justify-center w-20 h-20 bg-transparent'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            width={50} height={50} fill={recordState===RecordState.START ? 'green' : 'red'}>
              {svg_microphone}
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-small font-bold">Grabando</div>
            <Button className="text-tiny" onClick={() => {stop(true); document.querySelector("button[aria-label='Dismiss']").click();}}>Cancelar</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>) : null
  );
};

export default AudioRecorder;
