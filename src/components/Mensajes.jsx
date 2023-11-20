// Componente para renderizar los mensajes tanto del usuario como del sistema

import React, {useContext} from 'react';
import { ContextoConversacion } from '../context/context';

import {Card, CardHeader, CardBody, Image, Divider} from "@nextui-org/react";

const useConversacion = () => {
    return useContext(ContextoConversacion);
}
const Mensaje = (props) => {
  const {mensajes} = useConversacion();
  return (
      <div className={props.className}>
        {mensajes.map((mensaje, index) => {
          return (
            <div key={index}>
            <Card shadow className={`max-w-xl ${mensaje.usuario===process.env.REACT_APP_ASSISTANT_NAME ? 'float-left self-start bg-blue-200' : 'float-right self-end bg-green-200'}`}>
              <CardHeader className="flex gap-3">
                {mensaje.imagen && <Image src={mensaje.imagen.logo_Zorro} width={40} height={40} />}
                <div className='flex flex-col'>
                  <strong>{mensaje.usuario}</strong>
                </div>
              </CardHeader>
              <CardBody>
                {mensaje.mensaje}
              </CardBody>
            </Card>
            <Divider className='h-0'/>
            </div>
          );
        })}
      </div>
  );
}

export default Mensaje;