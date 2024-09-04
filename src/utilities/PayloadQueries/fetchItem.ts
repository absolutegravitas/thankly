import FetchItems from './fetchItems'

interface Props {
  collection: string,
  id?: number,
  slug?: string,
  depth?: number,
  context?: any,
  pagination?: boolean,
  revalidate?: number,
}

const FetchItem = async ( props : Props ) : Promise<any | null> => {
  const items = await FetchItems(props);

  if (items && items.length > 0) {
    return items[0];
  }

  return null;
}

export default FetchItem;

