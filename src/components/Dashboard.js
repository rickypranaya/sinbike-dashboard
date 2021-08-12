import React, {useMemo, useEffect} from 'react'
import { useTable } from "react-table"
import MOCK_DATA from './MockBikeData.json'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { HiLocationMarker } from 'react-icons/hi'
import { MdDelete } from 'react-icons/md'
import { FcDeleteDatabase } from 'react-icons/fc'
import Modal from 'react-modal';
import axios from "axios"
import Geocode from "react-geocode";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import useGeolocation from 'react-hook-geolocation'
import Select from 'react-select'
import { useSnackbar } from 'react-simple-snackbar'

Geocode.setApiKey("AIzaSyDylZmWObzBi3ImX3HB7YpU8cZ7gwWKbcE");
Geocode.setLanguage("en");
Geocode.setRegion("sg");
Geocode.setLocationType("ROOFTOP");
Geocode.enableDebug();

const containerStyle = {
    width: '70vw',
    height: '70vh'
  };

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

  const customStylesMap = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      display:'flex',
      justifyContent:'center',
      flexDirection:'column',
      alignItems:'center'
    },
  };

  const type_options = [
    { value: 'city', label: 'City Bike' },
    { value: 'road', label: 'Road Bike' },
  ]

  const status_options = [
    { value: 'available', label: 'Available' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'on_ride', label: 'On Ride' },
  ]

  const date_added_options = [
    { value: '30', label: 'Last 1 month' },
    { value: '15', label: 'Last 15 days' },
    { value: '7', label: 'Last 7 days' },
  ]

  const selectStyles ={
    control: (base) => ({
        ...base,
        minHeight: 30,
        display : 'flex',
        alignItems:'center',
        justifyContent:'center',
        margin:' 0'
      }),
      dropdownIndicator: (base) => ({
        ...base,
        paddingTop: 0,
        paddingBottom: 0,
      }),
      clearIndicator: (base) => ({
        ...base,
        paddingTop: 0,
        paddingBottom: 0,
      }),
     input: (provided, state) => ({
        ...provided,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        display : 'flex',
        alignItems:'center',
        padding: 0,
        margin: 0,
      }),
      option: (provided, state) => ({
         ...provided,
         padding: "2px",
         
       }),
       singleValue: (provided, state) => ({
        ...provided,
        display : 'flex',
        alignItems:'center',
        justifyContent:'center',
        alignItems:'center',
        padding: 0,
        margin: 0,
      }),
      placeholder: (provided, state) => ({
        ...provided,
        padding: 0,
        display:'flex',
      }),
   };

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


function Dashboard () {

    var moment = require('moment');
    const columns = useMemo(()=> COLUMNS, [])
    const [data, setData] = React.useState([]);
    const [ApiData, setApiData] = React.useState([]);

    //modal visibility
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalMapIsOpen, setMapIsOpen] = React.useState(false);
    const [modalDeleteIsOpen, setDeleteIsOpen] = React.useState(false);
    const [chosenRowID, setChosenRow] = React.useState('');

    //search
    const [searchTyped, setSearchedTyped] = React.useState('');
    const [searchStatus, setSearchedStatus] = React.useState('');
    const [searchDate, setSearchedDate] = React.useState('');
    const [isSearch, setIsSearch] = React.useState(false)


    //clicked address
    const [location, setLocation] = React.useState('choose location');

    //current lat and long
    const [curLat, setCurLat] = React.useState('1.3031115164247238');
    const [curLng, setCurLng] = React.useState('103.83385199724057');

    //marker
    const [isMarkerShown, setMarkerShown] = React.useState(false);
    const [clickLat, setClickLat] = React.useState('');
    const [clickLng, setClickLng] = React.useState('');

    //add Bike info
    const [bikeID, setBikeID] = React.useState('');
    const [bikeType, setType] = React.useState('');

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

    const [openSnackbar_Success, closeSnackbar] = useSnackbar(options_success)
    const [openAlert, closeALert] = useSnackbar(options_alert)
    const [openError, closeError] = useSnackbar(options_error)

    useEffect( () => {
        fetchData()
        
    },[]);

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

    //-------add-bike modal---------------
    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
        setLocation('Choose Location') 
        setMarkerShown(false)
        setClickLng('')
        setClickLat('')
        setBikeID('')
        setType('')
        setIsOpen(false);
    }
    //--------------------------------

    //--- map modal ------------------
    async function openMapModal() {
    await getCurrentLocation();

        setMapIsOpen(true);
    }

    function afterOpenMapModal() {
    }

    function closeMapModal() {
        setMapIsOpen(false);
    }
    //-------------------------------

    //--------delete modal------------
    function openDeleteModal() {
        setDeleteIsOpen(true);
    }

    function afterOpenDeleteModal() {
    }

    function closeDeleteModal() {
        setChosenRow('')
        setDeleteIsOpen(false);
    }
    //-------------------------------

    const geolocation = useGeolocation({
        enableHighAccuracy: true, 
        maximumAge:         15000, 
        timeout:            12000
    })

    const getCurrentLocation = async ()=>{
        var lat = await geolocation.latitude
        var long = await geolocation.longitude
        setCurLat(lat)
        setCurLng(long)
    }

    const getAddress = async (lat, long)=>{
    await Geocode.fromLatLng(lat, long).then(
        (response) => {
            const address =   response.results[0].formatted_address;
            setLocation(address)
        },
        (error) => {
          console.log(error);
        }
      );
    } 

    async function fetchData() {
        try {
        const result = await axios.post("https://sinbike.herokuapp.com/api/bike")
        const resultData = result.data.data;
        var dataLists=[]
        resultData.map(function(d, idx){
        const objectData =  {
                created_at:dateFormat(d.created_at, 1),
                bike_id: d.ID,
                type: d.type+" bike",
                location:  d.address,
                last_ride: d.last_ride ?dateFormat(d.last_ride, 2) : '-',
                status: d.status,
                lat:d.latitude,
                long: d.longitude
            }
            dataLists.push(objectData)
        })
        setData(dataLists.reverse())
        setApiData( dataLists)
        console.log(dataLists)

        } catch (error) {
        console.error(error);
        }
    }

    const dateFormat =(inputDate, index)=>{
        //index : 1 => "12/07/01"
        //index : 2 => "12/07/01 12:00:00"

        var date = new Date(inputDate)
        var day = date.getDate().toString().length == 1? '0'+date.getDate().toString() : date.getDate().toString()
        var month = (date.getMonth()+1).toString().length == 1? '0'+(date.getMonth()+1).toString() : (date.getMonth()+1).toString()
        var hours = date.getHours().toString().length == 1? '0'+date.getHours().toString() : date.getHours().toString()
        var minute = date.getMinutes().toString().length == 1? '0'+date.getMinutes().toString() : date.getMinutes().toString()
        var second = date.getSeconds().toString().length == 1? '0'+date.getSeconds().toString() : date.getSeconds().toString()



        var formatted = date.getFullYear() +'-'+month+'-'+ day
        if (index == 1){
            return formatted
        } else {
            return (formatted +' '+hours+':'+minute+':'+second)
        }
    }

    const handleClickedMap = async (e) => {
        let latitude =  await e.latLng.lat()
        let longitude  =  await e.latLng.lng()
        let lats = latitude.toString()
        let lngs = longitude.toString()
        setClickLat(latitude)
        setClickLng(longitude)
        setMarkerShown(true)
        await getAddress(lats, lngs)
    }

    const addBike = ()=>{
        var current_datetime = moment().format('YYYY-MM-DD HH:mm:ss');

        if (!bikeID) {
            openAlert('Please fill in Bike id')
        } else if (!bikeType) {
            openAlert('Please choose in Bike type')
        } else if (!clickLat) {
            openAlert('Please choose bike location')
        } else if (!location) {
            openAlert('Please choose bike location')
        } else {

            var body = {
                ID : bikeID,
                type : bikeType.value,
                latitude : clickLat.toString(),
                longitude : clickLng.toString(),
                address : location,
                status : 'available',
                created_at : current_datetime
            }
            
            axios.post('https://sinbike.herokuapp.com/api/bike_add', body)
                .then(response => 
                   {
                       closeModal()
                       fetchData()
                       openSnackbar_Success('New bike is successfully added')
                })
                .catch(error => {
                    openError('oops! something is wrong');
                    console.error('There was an error!', error);
                });

            // console.log(body)
            
        }        
    } 

    const deleteBike =()=>{
        axios.post('https://sinbike.herokuapp.com/api/bike_delete', {ID : chosenRowID})
                .then(response => 
                   {
                       closeDeleteModal()
                       fetchData()
                       openSnackbar_Success('Bike id '+chosenRowID+' was successfully removed')
                })
                .catch(error => {
                    openError('oops! something is wrong');
                    console.error('There was an error!', error);
                });
    }

    const searchRows = (event)=>{
        event.preventDefault();
        
        if (searchTyped != ''){
            
            var searched = searchTyped

            var l=0, r=searched.length -1;
            while(l < searched.length && searched[l] == ' ') l++;
            while(r > l && searched[r] == ' ') r-=1;

            var toSearch = searched.substring(l, r+1);
            var results = [];

            for(var i=0; i<ApiData.length; i++) {
                for(var key in ApiData[i]) {
                  if(ApiData[i][key].indexOf(toSearch)!=-1) {
                      if (!results.includes(ApiData[i])){
                        results.push(ApiData[i]);
                      }
                  }
                }
              }

            setData(results)
            setIsSearch(true)
        } else {
            setData(ApiData)
            setIsSearch(false)
        }
    }

    const searchSelected = (index, val)=>{
        //index : 2 => status
        //index : 3 => date added
        if (index == 2){
            setSearchedStatus(val)
            if (val){
                var obj = ApiData.filter(function (e) {
                    return e.status == val.value;
                });
                setData(obj)
            } else {
                setData(ApiData)
            }
        } else {
            setSearchedDate(val)
            if (val){
                var checkDate = moment().subtract(Number(val.value), 'days') 
                var obj = ApiData.filter(function (e) {
                    return moment(e.created_at) >= checkDate;
                });
                setData(obj)
            } else {
                setData(ApiData)
            }
        }
    }
    

    return (
        <div className="dashboard">
        <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
        > 
         <h3>New Bike</h3> 
         <div className="add-bike">
             <label style={{fontWeight:'600'}}>Bike ID</label>
             <input 
             onChange={(val)=>{
                setBikeID(val.target.value)
             }}
             type='text' placeholder='bike id' />
         </div>
         <div className="add-bike">
             <label style={{fontWeight:'600'}}>Starting Location</label>
             <div 
                onClick={()=>{openMapModal()}}
                style={{alignItems:'center',display:'flex', backgroundColor:'#f1f1f1', padding:'7px', borderRadius:'5px', margin:'10px 0 20px 0', fontSize:'14px', flexDirection:'row', color:'grey'}}> <HiLocationMarker color='#FF6B37'/> 
                {location} 
             </div>
         </div>
         <div className="add-bike">
             <label style={{fontWeight:'600'}}>Type</label>
             <Select 
             className="mySelect-box"
             classNamePrefix="mySelect"
             styles={selectStyles}
             isClearable={true}
             options={type_options}
             onChange={setType}
             />
         </div>
         <button onClick={addBike} className="modal-button" style={{alignSelf:'flex-end'}}>Save</button>
      </Modal>

      <Modal
        isOpen={modalMapIsOpen}
        onAfterOpen={afterOpenMapModal}
        onRequestClose={closeMapModal}
        style={customStylesMap}
        contentLabel="Map Modal"
        ariaHideApp={false}
      >
         <LoadScript
            googleMapsApiKey="AIzaSyDylZmWObzBi3ImX3HB7YpU8cZ7gwWKbcE"
         >
            <div style={{padding:'0 0 20px 0', color:'darkorange', fontWeight:'600'}}>
                Click on the map to add location
            </div>

            <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
                lat: isMarkerShown ? clickLat: Number(curLat) ,
                lng: isMarkerShown ? clickLng: Number(curLng) 
            }}
            zoom={19}
            onClick={handleClickedMap }
            >
            {isMarkerShown &&<Marker position={{ lat: clickLat, lng: clickLng }} />}
            </GoogleMap>

            <div onClick={closeMapModal} className="main-button" style={{marginTop:20, }}>
                Add Location
            </div>
         </LoadScript>
      </Modal>

      <Modal
        isOpen={modalDeleteIsOpen}
        onAfterOpen={afterOpenDeleteModal}
        onRequestClose={closeDeleteModal}
        style={customStyles}
        contentLabel="delete Modal"
        ariaHideApp={false}
      >
          <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <FcDeleteDatabase size={100}/>
            <span style={{fontWeight:'bold', fontSize:'20px', margin:'25px'}}> Are you sure you want to remove this?</span>
            <div style={{display:'flex', flexDirection:'row', alignItems:'center', alignSelf:'flex-end'}}>
                <div onClick={closeDeleteModal} style={{color:'grey', fontWeight:'500', margin:'0 25px', cursor: 'pointer'}}> Cancel </div>
                <div onClick={deleteBike} className='main-button'>Delete</div>
            </div>
            
          </div>

          
      </Modal>

            <h2 style={{textAlign:'left'}}>Dashboard</h2>
            
            <div style={{display:'flex', flexDirection:'row', marginTop:30, marginBottom:30}}>
                    <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                    <form  onChange={(v)=>{setSearchedTyped(v.target.value)}} onSubmit={searchRows} className="add-bike">
                        <legend style={{textAlign:'left', marginBottom:'3px', color:'white'}}>_</legend>
                        <input  type='text' placeholder='Search...' />
                    </form>					

                    <div style={{width:'20%', marginLeft:20, marginRight:20}}>       
                    <legend style={{textAlign:'left'}}>Status</legend>
                    <Select 
                        className="mySelect-box"
                        classNamePrefix="mySelect"
                        styles={selectStyles}
                        isClearable={true}
                        options={status_options}
                        onChange={(val)=>{
                            searchSelected(2,val)
                        }}
                        />
                    </div>    

                    <div style={{width:'20%', marginLeft:20, marginRight:20}}>       
                    <legend style={{textAlign:'left'}}>Date added</legend>
                    <Select 
                        className="mySelect-box"
                        classNamePrefix="mySelect"
                        styles={selectStyles}
                        isClearable={true}
                        options={date_added_options}
                        onChange={(val)=>{
                            searchSelected(3,val)
                        }}
                        />
                    </div> 
                    </div>
                    <button onClick={()=>{openModal()}} className="btn" id="myBtn"><i className="fa fa-plus"></i> + New Bike</button>
            
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
                                <td> 
                                    <div style={{cursor:'pointer'}} onClick={()=>{setChosenRow(row.values.bike_id); openDeleteModal()}}>
                                        <MdDelete size={20} color='#FF3C43'/> 
                                    </div>
                                </td>
                            </tr>
                        )
                })}
            </tbody>
        </table>
        </div>
    )
}

export default Dashboard;