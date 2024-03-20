import BaseUrl from "../const/base_url";

export default function loadProducts() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [imageUris, setImageUris] = useState({});

    useEffect(() => {
        fetch(BaseUrl() + 'Product/GetAll')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const promises = data.map(async (item) => {
                const response = await fetch(BaseUrl() + 'Product/GetImageById', {
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