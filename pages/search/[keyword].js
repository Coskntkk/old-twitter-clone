import { useRouter } from "next/router"
import SearchResult from '../../components/SearchResult/SearchResult'

const Keyword = () => {
    const router = useRouter()
    const { keyword } = router.query
    return (
        <SearchResult keyword={keyword} />
    )
}

export default Keyword