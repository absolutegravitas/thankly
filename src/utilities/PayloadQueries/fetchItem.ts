import FetchItems from './fetchItems'

interface Props {
  collection: string,
  slug: string,
  depth?: number,
  revalidate?: number
}

const FetchItem = async ( props : Props ) : Promise<any | null> => {
  
  const items = await FetchItems(props);
  const item = items[0];
  
  return item;
}

export default FetchItem;