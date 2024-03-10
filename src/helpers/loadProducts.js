export default function loadProducts() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [imageUris, setImageUris] = useState({});

    useEffect(() => {
        fetch('http://192.168.0.145/Product/GetAll')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const promises = data.map(async (item) => {
                const response = await fetch('http://192.168.0.145/Product/GetImageById', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(item.id),
                });
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onload = () => {
                    setImageUris(prevState => ({
                        ...prevState,
                        [item.id]: reader.result,
                    }));
                };
                reader.readAsDataURL(blob);
            });
            await Promise.all(promises);
        };
        fetchData();
    }, [data]);
    return data
}