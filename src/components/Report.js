import React, {useMemo, useState, useEffect} from 'react'
import { useTable } from "react-table"
import Modal from 'react-modal';
import axios from "axios"
import { storage } from '../firebase';
import { FcStackOfPhotos, FcBrokenLink} from 'react-icons/fc';
import { useSnackbar } from 'react-simple-snackbar'

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius:'10px',
      display:'flex',
      flexDirection:'column',
      padding:' 10px 25px',
      fontSize:'15px'
    },
  };

function Report () {
    //snackbar
    const options_success = {
    position: 'top-center',
    style: {
      backgroundColor: '#3BB502',
      color: 'white',
      fontSize: '16px',
      borderRadius: '10px',
      textAlign: 'center',
    },
    closeStyle: {
      color: 'white',
      fontSize: '16px',
    },
  }

  const options_alert = {
    position: 'top-center',
    style: {
      backgroundColor: 'grey',
      color: 'white',
      fontSize: '16px',
      borderRadius: '10px',
      textAlign: 'center',
    },
    closeStyle: {
      color: 'white',
      fontSize: '16px',
    },
  }

  const options_error = {
    position: 'top-center',
    style: {
      backgroundColor: '#FF3C43',
      color: 'white',
      fontSize: '16px',
      borderRadius: '10px',
      textAlign: 'center',
    },
    closeStyle: {
      color: 'white',
      fontSize: '16px',
    },
  }

    const [openSuccess, closeSnackbar] = useSnackbar(options_success)
    const [openAlert, closeALert] = useSnackbar(options_alert)
    const [openError, closeError] = useSnackbar(options_error)

    const COLUMNS =[
        {
            Header : 'ID',
            accessor : 'id'
        },
        {
            Header : 'DATE REPORTED',
            accessor : 'created_at'
        },
        {
            Header : 'BIKE ID',
            accessor : 'bike_id'
        },
        {
            Header : 'FAULTS',
            accessor : 'faults'
        },
        {
            Header : 'DETAILS',
            accessor : 'details'
        },
        {
            Header : 'STATUS',
            accessor : 'status'
        }
    ]

   async function openModal(value) {
        setSelected(value);
        await getImage(value);
        setIsOpen(true);
      }

    const getImage = async (val) =>{
        var img = val.photos
        if(img){
            await storage.child(img).getDownloadURL().then((url) => {
                setImage(url)
            }).catch((error) => {
                console.log(error)
            });
        } else {
            setImage('')
        }
        
    }
    
      function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
      }
    
      function closeModal() {
        setIsOpen(false);
      }

      async function openSuspendModal(value) {
        setModalSuspend(true);
      }

      function afterOpenSuspendModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
      }
    
      function closeSuspendModal() {
        setSelectedSuspend('')
        setModalSuspend(false);
      }

    const columns = useMemo(()=> COLUMNS, [])
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalSuspendOpen, setModalSuspend] = useState(false);
    const [selectedRow, setSelected] = useState({});
    const[data, setData]= useState([])
    const [image, setImage] = useState('')
    const [selectedSuspend, setSelectedSuspend] = useState('')

    useEffect( () => {
        fetchData()
        // getImage('flat_tyre.jpg')
    },[]);

    const suspend=()=>{
        console.log(selectedSuspend)
        axios.post('https://sinbike.herokuapp.com/api/bike_suspend', {bike_id : selectedSuspend})
                .then(response => 
                   {
                       closeSuspendModal()
                       fetchData()
                       openSuccess('Bike was successfully suspended')
                })
                .catch(error => {
                    openError('oops! something is wrong');
                    console.error('There was an error!', error);
                });
    }

    async function fetchData() {
        try {
        const result = await axios.post("https://sinbike.herokuapp.com/api/reports")
        const resultData = result.data.data;
        // console.log(resultData)
        resultData.map((d)=>{
            d.created_at = dateFormat(d.created_at)
        })
        setData(resultData.reverse())
        
        } catch (error) {
        console.log(error);
        }
    }

    const dateFormat =(inputDate)=>{
        var date = new Date(inputDate)
        var day = date.getDate().toString().length == 1? '0'+date.getDate().toString() : date.getDate().toString()
        var month = (date.getMonth()+1).toString().length == 1? '0'+(date.getMonth()+1).toString() : (date.getMonth()+1).toString()
        var hours = date.getHours().toString().length == 1? '0'+date.getHours().toString() : date.getHours().toString()
        var minute = date.getMinutes().toString().length == 1? '0'+date.getMinutes().toString() : date.getMinutes().toString()
        var second = date.getSeconds().toString().length == 1? '0'+date.getSeconds().toString() : date.getSeconds().toString()
        var formatted = date.getFullYear() +'-'+month+'-'+ day
        return (formatted +' '+hours+':'+minute+':'+second)
    }

    const tableInstance = useTable({
        columns,
        data
    })

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance


    return (
        <div className="report">
        <Modal
            ariaHideApp={false}
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
         <h4>BIKE ID {selectedRow.bike_id}</h4> 
         <div style={{display:'flex'}}>
             {image &&
            <img className="report-main-image" src={image} alt="faulty bike" />}
         </div>

         <div style={{display:'flex', flexDirection:'column'}}>
             <label style={{fontWeight:'bold', margin:'10px 0'}}>Type</label>
             {selectedRow.faults}
         </div>

         <div style={{display:'flex', flexDirection:'column', maxWidth:'40vw'}}>
             <label style={{fontWeight:'bold', margin:'10px 0'}}>Details</label>
             <span style={{textAlign:'justify'}}>{selectedRow.details}</span>
         </div>

         <div style={{display:'flex', flexDirection:'column'}}>
             <label style={{fontWeight:'bold', margin:'10px 0'}}>Date Reported</label>
             {selectedRow.created_at}
         </div>

         
      </Modal>

      <Modal
        isOpen={modalSuspendOpen}
        onAfterOpen={afterOpenSuspendModal}
        onRequestClose={closeSuspendModal}
        style={customStyles}
        contentLabel="delete Modal"
        ariaHideApp={false}
    >
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <FcBrokenLink size={100} color='lightgreen'/>
            <span style={{fontWeight:'bold', fontSize:'20px', margin:'25px'}}> Are you sure you want to suspend this bike?</span>
            <div style={{display:'flex', flexDirection:'row', alignItems:'center', alignSelf:'flex-end'}}>
                <div onClick={closeSuspendModal} style={{color:'grey', fontWeight:'500', margin:'0 25px', cursor: 'pointer'}}> Cancel</div>
                <div onClick={suspend} className='main-button'>Suspend</div>
            </div>
            
        </div>

        
    </Modal>

            <h2 style={{textAlign:'left'}}>Faulty Bike Reports</h2>
            <table className="table" {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup)=>(
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column)=>(
                                <th {...column.getHeaderProps()}>{column.render('Header')} </th>
                        ))}
                        <th> PHOTOS</th>
                        <th> </th>
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row)=>{
                        prepareRow(row)
                        return(
                            <tr {...row.getRowProps()}
                            >
                                {row.cells.map((cell)=>{
                                        return <td style={{cursor:'pointer'}} onClick={()=>{openModal(row.original)}} {...cell.getCellProps()}>{cell.render('Cell')} </td>
                                })}
                                <td onClick={()=>{openModal(row.original)}} style={{textAlign:'center', cursor:'pointer'}}>
                                  {row.original.photos && <FcStackOfPhotos size={35}/>}
                                </td>
                                <td> {row.values.status !== "suspended" && 
                                    <div onClick={()=>{setSelectedSuspend(row.values.bike_id) ;openSuspendModal()}} className='main-button'>
                                        Suspend
                                    </div>
                                }</td>
                            </tr>
                        )
                })}
            </tbody>
        </table>
        </div>
    )
}

export default Report;