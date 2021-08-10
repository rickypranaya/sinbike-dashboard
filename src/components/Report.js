import React, {useMemo} from 'react'
import MOCK_DATA from './MockReportData.json'
import { useTable } from "react-table"
import Modal from 'react-modal';
import flat_tyre from '../assets/flat_tyre.jpg'

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
    const COLUMNS =[
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
            accessor : 'fault'
        },
        {
            Header : 'DETAILS',
            accessor : 'details'
        },
        {
            Header : 'PHOTOS',
            accessor : 'photos'
        },
        {
            Header : 'STATUS',
            accessor : 'status'
        }
    ]

    function openModal(value) {
        setSelected(value);
        setIsOpen(true);
      }
    
      function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
      }
    
      function closeModal() {
        setIsOpen(false);
      }

    const columns = useMemo(()=> COLUMNS, [])
    const data = useMemo(()=> MOCK_DATA, [])
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [selectedRow, setSelected] = React.useState({});

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
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
         <h4>BIKE ID {selectedRow.bike_id}</h4> 
         <div style={{display:'flex'}}>
            <img className="report-main-image" src={flat_tyre} alt="faulty bike" />
            <div className="report-column-image">
             <img src={flat_tyre} alt="faulty bike" />
             <img src={flat_tyre} alt="faulty bike" />
             <img src={flat_tyre} alt="faulty bike" />
             <img src={flat_tyre} alt="faulty bike" />
            </div>
         </div>

         <div style={{display:'flex', flexDirection:'column'}}>
             <label style={{fontWeight:'bold', margin:'10px 0'}}>Type</label>
             {selectedRow.fault}
         </div>

         <div style={{display:'flex', flexDirection:'column', maxWidth:'57vh'}}>
             <label style={{fontWeight:'bold', margin:'10px 0'}}>Details</label>
             <span style={{textAlign:'justify'}}>{selectedRow.details}</span>
         </div>

         <div style={{display:'flex', flexDirection:'column'}}>
             <label style={{fontWeight:'bold', margin:'10px 0'}}>Date Reported</label>
             {selectedRow.created_at}
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
                        <th></th>
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row)=>{
                        prepareRow(row)
                        return(
                            <tr {...row.getRowProps()}
                            onClick={()=>{openModal(row.values)}}>
                                {row.cells.map((cell)=>{
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')} </td>
                                })}
                                <td> {row.values.status === "Suspended"? "Suspend" : null}</td>
                            </tr>
                        )
                })}
            </tbody>
        </table>
        </div>
    )
}

export default Report;