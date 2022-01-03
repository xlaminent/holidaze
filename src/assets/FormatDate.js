export default function dateFormatter(dateInMilli) {
    return new Date(dateInMilli).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit'});
}