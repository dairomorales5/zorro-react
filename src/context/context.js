// Contexto de la conversación
import React, { createContext, useEffect, useState } from "react";
import {Spinner} from "@nextui-org/react";
import logo_Zorro from '../img/logo_Zorro.jpeg';

export const ContextoConversacion = createContext();

const createSystemMessage = (text) => {
  return {
    usuario: process.env.REACT_APP_ASSISTANT_NAME,
    mensaje: text,
    imagen: {logo_Zorro}
  };
}
export const ConversationProvider = ({ children }) => {
  const [mensajes, setMensajes] = useState([createSystemMessage('')]);
  const [progreso, setProgreso] = useState(0);
  const [json, setJson] = useState({});
  const [transcribiendo, setTranscribiendo] = useState(false);
  const [typing, setTyping] = useState(false);
  const [profesor, setProfesor] = useState('');
  const [materia, setMateria] = useState('');
  const agregarMensaje = (texto) => {
    setMensajes(prevMensajes => {
      const ultimoMensaje = prevMensajes[prevMensajes.length - 1];
      ultimoMensaje.mensaje = texto;
      return [...prevMensajes.slice(0, -1), ultimoMensaje];
    });
  };
  
  useEffect(() => {
    if(transcribiendo){
      setMensajes([...mensajes, {'usuario':'Usuario',
      'mensaje': <Spinner label="Escuchando..." color="primary" />,
      'imagen':''
      }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcribiendo]);
  
  useEffect(() => {
    if(Object.keys(json).length > 0){
      //Calcular la proporción de llaves llenas y vacías
      const llaves = Object.keys(json);
      const valores = Object.values(json);
      const llenas = valores.filter((valor) => valor !== '' && valor !== null && valor !== undefined);
      const proporcion = llenas.length/llaves.length;
      setProgreso(Math.ceil(proporcion*100));
    }else{
      setProgreso(0);
    }
  }, [json])

  return (
    <ContextoConversacion.Provider
    value={{ mensajes, setMensajes, agregarMensaje,
    transcribiendo, setTranscribiendo, createSystemMessage,
    progreso, setProgreso, json, setJson, typing, setTyping,
    profesor, setProfesor, materia, setMateria }}>
      {children}
    </ContextoConversacion.Provider>
  );
}