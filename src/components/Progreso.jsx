// Componente con el progreso estimado del progreso de la conversación
import {CircularProgress, Switch} from "@nextui-org/react";
import { useContext } from "react";
import { ContextoConversacion } from '../context/context';

const useConversacion = () => {
  return useContext(ContextoConversacion);
}

const Progreso = (props) => {
  const {progreso} = useConversacion();
    return (
      <div className="flex flex-col items-center sticky" style={{top: '0'}}>
        <CircularProgress
          label={<span>Progreso estimado<br/>de la conversación</span>}
          size="lg"
          value={progreso}
          color="success"
          showValueLabel={true}
          className={props.className+" flex-1"}
        />
        <Switch>Envío manual</Switch>
      </div>
    );
}

export default Progreso;