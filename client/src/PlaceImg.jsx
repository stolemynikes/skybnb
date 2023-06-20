export default function PlaceImg({place, index=0, className=null}) {

    if (!place.photos?.length) {
        return '';
    }

    if(!className) {
        className= 'object-cover rounded-xl w-32 h-32'
    }
  return (
    <img className={className} src={'https://api.pepijnscheer.nl/uploads/' + place.photos[index]} alt=''/>
  )
}
