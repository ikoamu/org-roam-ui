import { useRef, useState, useMemo, useCallback, useContext, useEffect } from 'react';
import Fuse, { FuseResult } from 'fuse.js';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ModalBody,
  ModalContent,
  ModalHeader,
  Box,
} from '@chakra-ui/react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import data from './searchdata.json';
import { SearchResultItem } from './SearchResultItem';
import { ThemeContext } from '../../util/themecontext';
import { useDebounce } from './useDebounce'; // Import the debounce hook
import fuseIndex from './fuse-index.json'; // Static import of the precomputed index

export type SearchData = {
  id: string;
  title: string;
  tags: string[] | null;
  content: string;
};

export const SearchContent: React.FC<{
  onClickResultItem: (id: string) => void;
}> = ({ onClickResultItem }) => {
  const { emacsTheme } = useContext(ThemeContext);
  type Theme = { [color: string]: string };
  const themeColors = emacsTheme[1] as Theme;
  const inputValue = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<FuseResult<SearchData>[]>([]);
  const [query, setQuery] = useState('');

  // Debounce the query
  const debouncedQuery = useDebounce(query, 300); // 300ms debounce delay

  // Create the Fuse instance with the dataset, options, and the precomputed index
  const fuse = useMemo(() => {
    console.log('Initializing Fuse with index...');
    const fuseOptions = {
      keys: ['tags', 'title', 'content'],
      minMatchCharLength: 2,
      includeMatches: true,
    };

    // Parse the index and create the Fuse instance
    const myIndex = Fuse.parseIndex(fuseIndex);
    return new Fuse<SearchData>(data, fuseOptions, myIndex);
  }, []); // The empty dependency array ensures this runs once on mount

  // Handle search with debounced query
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]); // Early return to avoid unnecessary searches
      return;
    }

    const searchResults = fuse.search(debouncedQuery) as FuseResult<SearchData>[];
    setResults(searchResults);
  }, [debouncedQuery, fuse]);

  // Handle input change
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    []
  );

  return (
    <ModalContent>
      <ModalHeader>
        <InputGroup borderColor={themeColors['fg']}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon />
          </InputLeftElement>
          <Input type="text" ref={inputValue} onChange={onChange} placeholder="Search node" />
        </InputGroup>
      </ModalHeader>
      {!!results.length && (
        <Scrollbars
          autoHeight={true}
          autoHide={true}
          autoHeightMax={500}
          renderThumbVertical={({ style, ...props }: { style: React.CSSProperties }) => (
            <Box
              style={{
                ...style,
                borderRadius: 0,
              }}
              {...props}
            />
          )}
        >
          <ModalBody maxHeight={500}>
            <List spacing={3}>
              {results.map((result) => (
                <SearchResultItem
                  key={result.item.id}
                  result={result}
                  onClick={onClickResultItem}
                />
              ))}
            </List>
          </ModalBody>
        </Scrollbars>
      )}
    </ModalContent>
  );
};
