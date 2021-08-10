import React, {useMemo} from 'react'
import { useTable } from "react-table"
import MOCK_DATA from './MockBikeData.json'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import Modal from 'react-modal';

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
      padding:'25px'
    },
  };

function Dashboard () {
    const COLUMNS =[
        {
            Header : 'DATE ADDED',
            accessor : 'created_at'
        },
        {
            Header : 'BIKE ID',
            accessor : 'bike_id'
        },
        {
            Header : 'TYPE',
            accessor : 'type'
        },
        {
            Header : 'CURRENT LOCATION',
            accessor : 'location'
        },
        {
            Header : 'LAST RIDE',
            accessor : 'last_ride'
        },
        {
            Header : 'STATUS',
            accessor : 'status'
        }
    ]

    const columns = useMemo(()=> COLUMNS, [])
    const data = useMemo(()=> MOCK_DATA, [])
    const [modalIsOpen, setIsOpen] = React.useState(false);

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


  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }


    return (
        <div className="dashboard">
        <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
         <h3>New Bike</h3> 
         <div className="add-bike">
             <label style={{fontWeight:'600'}}>Bike ID</label>
             <input type='text' placeholder='bike id' />
         </div>
         <div className="add-bike">
             <label style={{fontWeight:'600'}}>Starting Location</label>
             <input type='text' placeholder='bike id' />
         </div>
         <div className="add-bike">
             <label style={{fontWeight:'600'}}>Type</label>
             <input type='text' placeholder='bike id' />
         </div>
         <button className="modal-button" style={{alignSelf:'flex-end'}}>Save</button>
      </Modal>

            <h2 style={{textAlign:'left'}}>Dashboard</h2>
            
            <div style={{display:'flex', flexDirection:'row', marginTop:30, marginBottom:30}}>
                    <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                    <input placeholder="Search" type="text" className="myInput"/>						

                    <div style={{width:'15%', marginLeft:20, marginRight:20}}>       
                    <legend>Status</legend>
                    <select name="status" className="myStatus">
                        <option value="all" selected>All</option>
                        <option value="available">Available</option>
                        <option value="suspended">Suspended</option>
                        <option value="onride">On ride</option>
                    </select>
                    </div>    
            

                    <div style={{width:'15%', marginLeft:20, marginRight:20}}>       
                    <legend>Date added</legend>
                    <select className="abc" classNamePrefix="abc">
                        <option value="30" selected>Last 30 days</option>
                        <option value="25">Last 25 days</option>
                        <option value="20">Last 20 days</option>
                        <option value="15">Last 15 days</option>
                        <option value="10">Last 10 days</option>
                        <option value="7">Last 7 days</option>
                        <option value="5">Last 5 days</option>
                        <option value="3">Last 3 days</option>
                    </select>
                    </div> 
                    </div>
                    <button onClick={()=>{openModal()}} className="btn" id="myBtn"><i class="fa fa-plus"></i> + New Bike</button>
            
            </div>

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
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell)=>{
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')} </td>
                                })}
                                <td> <BiDotsHorizontalRounded/> </td>
                            </tr>
                        )
                })}
            </tbody>
        </table>
        </div>
    )
}


export default Dashboard;