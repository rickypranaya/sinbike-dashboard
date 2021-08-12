import { useSnackbar } from 'react-simple-snackbar'

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

