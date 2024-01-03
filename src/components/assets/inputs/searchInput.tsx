import { SearchTwoTone } from '@mui/icons-material';
import { Autocomplete, CircularProgress, InputAdornment, TextField } from '@mui/material';
import React, {Fragment} from 'react';
import { styled } from '@mui/material';

interface Film {
    title: string;
    year: number;
}
  
function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}
const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper,
}));

const GroupItems = styled('ul')({
    padding: 0,
});

export const SearchInput = () => {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<readonly Film[]>([]);
    const loading = open && options.length === 0;
  
    React.useEffect(() => {
      let active = true;
  
      if (!loading) {
        return undefined;
      }
  
      (async () => {
        await sleep(1e3);
  
        if (active) {
            const mappedOptions = topFilms.map((film) => {
                const firstLetter = film.title[0].toUpperCase();
                return {
                    firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                    ...film,
                };
            });

            setOptions(mappedOptions);
        }
      })();
  
      return () => {
        active = false;
      };
    }, [loading]);
  
    React.useEffect(() => {
      if (!open) {
        setOptions([]);
      }
    }, [open]);
  
    return (
      <Autocomplete
        id="asynchronous-demo"
        sx={{ width: 300 }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={(option) => option.title}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Asynchronous"
            InputProps={{
              ...params.InputProps,
              sx: {
                border: "none",
                outline: "none",
              },
              startAdornment: (
                <InputAdornment position="start">
                    <SearchTwoTone sx={{color: "#637381"}}/>
                </InputAdornment>
              ),
              endAdornment: (
                <Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
        renderGroup={(params) => (
            <li key={params.key}>
              <GroupHeader>{params.group}</GroupHeader>
              <GroupItems>{params.children}</GroupItems>
            </li>
          )}
      />
    );
  }

  const topFilms = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
  ];