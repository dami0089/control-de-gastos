import { useEffect, useState } from 'react'
import Filtros from './components/Filtros'
import Header from './components/Header'
import ListadoGastos from './components/ListadoGastos'
import Modal from './components/Modal'
import { generarId } from './helpers'
import IconoNuevoGasto from './img/nuevo-gasto.svg'

function App() {

  const [presupuesto, setPresupuesto] =useState(Number(localStorage.getItem('presupuesto')) ?? 0)
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false)
  const [modal,setModal] = useState(false)
  const [animarModal,setAnimarmodal] = useState(false)

  const [gastos, setGastos] = useState (
    localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : []
  )

  const [filtro, setFiltro] = useState('')
  const [gastosFiltrados, setGastosFiltrados] = useState([])


  const [gastoEditar, setGastoEditar] = useState({})

  useEffect(()=>{
    if(Object.keys(gastoEditar).length>0){
      setModal(true)
      setTimeout(()=>{
          setAnimarmodal(true)
          
      },300);
    }
  },[gastoEditar])

  useEffect (()=>{
    localStorage.setItem('presupuesto',presupuesto ?? 0)
  },[presupuesto])

  useEffect(() => {
    const presupuestoLS = Number(localStorage.getItem('presupuesto')?? 0)
  
    if(presupuestoLS > 0 ){
      setIsValidPresupuesto(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('gastos', JSON.stringify(gastos)??[])
  

  }, [gastos])

  useEffect(() => {
    if(filtro){
      //filtrar gastos por categoria
      const gastosFiltrados=gastos.filter(gasto => gasto.categoria === filtro)
      setGastosFiltrados(gastosFiltrados)
    }
  }, [filtro])
  

  const handleNuevoGasto = () => {
    setModal(true)
    setGastoEditar({})
    setTimeout(()=>{
        setAnimarmodal(true)
        
    },300);
  }

  const guardarGasto = gasto =>{
    if (gasto.id){
      //Actualizar
      const gastosActualizados = gastos.map(gastoState => gastoState.id === gasto.id ? gasto : gastoState)

      setGastos(gastosActualizados)
      setGastoEditar({})
    } else{
      //nuevo gasto
      gasto.id = generarId ();
      gasto.fecha = Date.now();
      setGastos ([...gastos,gasto])
    }
   
    setAnimarmodal(false)
        setTimeout(()=>{
            setModal(false)
        },500)
  }

  const eliminarGasto = id => {
    const gastosActualizados = gastos.filter(gasto => gasto.id !== id);

    setGastos(gastosActualizados)
  }

  return (
    <div className={modal? 'fijar' : ''}>
      <Header 
      setGastos = {setGastos}
      gastos = {gastos}
      presupuesto={presupuesto} 
      setPresupuesto={setPresupuesto}
      isValidPresupuesto = {isValidPresupuesto}
      setIsValidPresupuesto = {setIsValidPresupuesto}

      
      />
      {isValidPresupuesto && (
        <>
        
        <main>
        <Filtros
        filtro = {filtro}
        setFiltro = {setFiltro}

        />

            <ListadoGastos
              gastos = {gastos}
              setGastoEditar = {setGastoEditar}
              eliminarGasto = {eliminarGasto}
              filtro ={filtro}
              gastosFiltrados = {gastosFiltrados}

              
            />
        </main>
        <div className='nuevo-gasto'>
        <img 
            src={IconoNuevoGasto} 
            alt='Icono nuevo gasto' 
            onClick={handleNuevoGasto}

          />
       
      </div>
      </>
      )}

      {modal && <Modal 
                  animarModal={animarModal} 
                  setModal = {setModal} 
                  setAnimarmodal = {setAnimarmodal}
                  guardarGasto = {guardarGasto}
                  gastoEditar = {gastoEditar}
                  setGastoEditar ={setGastoEditar}
      />}
      
    </div>
    
  )
}

export default App
