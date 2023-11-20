// Componente para la creación de la caja de texto de entrada del usuario
// Será un textarea que se expandirá automáticamente a medida que el usuario escriba
import { useState, useContext } from "react";
import {Textarea, Button} from "@nextui-org/react";
import { ContextoConversacion } from '../context/context';
import { conversationUpdate } from "./js/openai";

const useConversacion = () => {
  return useContext(ContextoConversacion);
}


const CajaTexto = () => {
  const {mensajes,setMensajes, createSystemMessage, agregarMensaje, json,setJson,typing, setTyping,profesor,materia} = useConversacion();
  const [mensaje, setMensaje] = useState("");
  const handleTyping = (e) => {
    let actual = e.target.value;
    setMensaje(actual);
    setTyping(actual.length > 0);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    // Limpia el textarea
    e.target.reset();
    setTyping(false);
    console.log("Submit");
    setMensajes([...mensajes, {'usuario':'Usuario',
      'mensaje': '',
      'imagen':''
      }]);
    conversationUpdate(agregarMensaje,mensaje,setMensajes,createSystemMessage,json,setJson,profesor,materia);
  };
    return (
      <form onSubmit={handleSubmit} className="w-full flex flex-row items-center">
        <Textarea
          label="Mensaje"
          placeholder="Describe tu experiencia con el profesor"
          onChange={handleTyping}
        />
        {typing && <Button type="submit" className='flex items-center justify-center w-20 h-20 bg-transparent'>Enviar</Button>}
      </form>
    );
}

export default CajaTexto;