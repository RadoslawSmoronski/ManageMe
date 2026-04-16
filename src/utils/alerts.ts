import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Toast = MySwal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
});

export const confirmDelete = async (title: string, text: string) => {
  const result = await MySwal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  });

  return result.isConfirmed;
};

export const successToast = async (title: string) => {
  await Toast.fire({
    icon: 'success',
    title,
  });
};