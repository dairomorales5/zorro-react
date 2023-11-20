// Componente para hacer el header del aplicativo, basándonse en el
// componente Navbar de NextUI
import logo_Zorro from '../img/logo_Zorro.jpeg'
import {Avatar, Navbar, NavbarBrand, NavbarContent, NavbarItem,
  Button, Autocomplete, AutocompleteItem} from "@nextui-org/react";

import { useContext, useEffect } from 'react';
import { ContextoConversacion } from '../context/context';

const useConversacion = () => {
  return useContext(ContextoConversacion);
}

const Header = () => {
  const {agregarMensaje,profesor,setProfesor,materia,setMateria} = useConversacion();
  const handleProfesor = (e) => {
    setProfesor(e);
  }
  const handleMateria = (e) => {
    setMateria(e);
  }
  useEffect(() => {
    agregarMensaje(`¡Hola! Soy ZORRO. Un chatbot especializado en obtener la percepción de estudiantes universitarios sobre sus profesores. Me gustaría conocer tu opinión sobre el profesor ${profesor} en la materia ${materia}. Siéntete libre de poner aquí tu opinión.`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profesor,materia]);
    return (
      <Navbar>
      <NavbarBrand>
      <Avatar src={logo_Zorro} className="w-10 h-10 text-large" />
        <p className="font-bold text-inherit">ZoRRO</p>
      </NavbarBrand>
      <NavbarContent className="gap-4" justify="center">
        <NavbarItem>
          <Autocomplete label="Profesor" placeholder="Seleccione un profesor" onInputChange={handleProfesor}>
            <AutocompleteItem value="1">Pedro Caro</AutocompleteItem>
            <AutocompleteItem value="2">María Acosta</AutocompleteItem>
          </Autocomplete>
        </NavbarItem>
        <NavbarItem>
          <Autocomplete label="Materia" placeholder="Seleccione un materia" onInputChange={handleMateria}>
            <AutocompleteItem value="1">Matemáticas</AutocompleteItem>
            <AutocompleteItem value="2">Lenguaje</AutocompleteItem>
          </Autocomplete>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button color="primary" href="#" variant="flat">
            Crear cuenta
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    );
}

export default Header;