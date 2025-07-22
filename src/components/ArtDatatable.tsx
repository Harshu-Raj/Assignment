import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Toast } from 'primereact/toast';

interface ArtItem {
  id: string;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const ArtDataTable: React.FC = () => {
  const [data, setData] = useState<ArtItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(12); 
  const [selection, setSelection] = useState<ArtItem[]>([]);
  const [persistentSelectedItems, setPersistentSelectedItems] = useState<Map<string, ArtItem>>(new Map());

  const op = useRef<OverlayPanel>(null);
  const [numRowsToSelect, setNumRowsToSelect] = useState<string>('');
  const toast = useRef<Toast>(null);

  const API_BASE_URL = "https://api.artic.edu/api/v1/artworks";

  useEffect(() => {
    const currentPage = (first / rows) + 1;
    fetchData(currentPage, rows);
  }, [first, rows]);

  const fetchData = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      setData(result.data);
      setTotalRecords(result.pagination.total);

      const newSelection: ArtItem[] = [];
      result.data.forEach((item: ArtItem) => {
        if (persistentSelectedItems.has(item.id)) {
          newSelection.push(item);
        }
      });
      setSelection(newSelection);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.current?.show({severity:'error', summary: 'Error', detail: 'Failed to fetch data', life: 3000});
    } finally {
      setLoading(false);
    }
  };

  const onPage = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const onSelectionChange = (event: any) => {
    const currentSelection: ArtItem[] = event.value;
    setSelection(currentSelection);

    setPersistentSelectedItems(prevMap => {
      const newMap = new Map(prevMap);

      data.forEach(item => {
        if (!currentSelection.some(sel => sel.id === item.id) && prevMap.has(item.id)) {
          newMap.delete(item.id);
        }
      });

      currentSelection.forEach(item => {
        newMap.set(item.id, item);
      });

      return newMap;
    });
  };


  const codeHeaderTemplate = (options: any) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          icon="pi pi-chevron-down"
          className="p-button-text p-button-sm" 
          onClick={(e) => {
            setNumRowsToSelect('');
            op.current?.toggle(e);
          }}
          aria-haspopup
          aria-controls="overlay_panel"
        />
      </div>
    );
  };

  
  const overlayPanelContent = (
    <div style={{ display: 'flex', gap: '5px' }}> 
      <InputText
        placeholder={`Enter total rows to select (max ${totalRecords})...`}
        value={numRowsToSelect}
        onChange={(e) => {
          if (/^\d*$/.test(e.target.value)) {
            setNumRowsToSelect(e.target.value);
          }
        }}
      />
      <Button
        label="submit"
        onClick={async () => {
          const num = parseInt(numRowsToSelect, 10);

          if (isNaN(num) || num < 0) {
            toast.current?.show({severity:'warn', summary: 'Invalid Input', detail: 'Please enter a valid positive number.', life: 3000});
            return;
          }

          if (num > totalRecords) {
            toast.current?.show({severity:'warn', summary: 'Too Many Rows', detail: `Cannot select ${num} rows. Total available: ${totalRecords}.`, life: 3000});
            return;
          }

          
          setPersistentSelectedItems(new Map());
          setSelection([]);

          let itemsToSelectCounter = num;
          let currentPageNum = 1;
          const tempPersistentSelections = new Map<string, ArtItem>();

          while (itemsToSelectCounter > 0 && currentPageNum <= Math.ceil(totalRecords / rows)) {
            try {
              const response = await fetch(`${API_BASE_URL}?page=${currentPageNum}&limit=${rows}`);
              if (!response.ok) throw new Error(`Failed to fetch page ${currentPageNum}`);
              const result = await response.json();
              const pageData: ArtItem[] = result.data;

              for (const item of pageData) {
                if (itemsToSelectCounter > 0) {
                  tempPersistentSelections.set(item.id, item);
                  itemsToSelectCounter--;
                } else {
                  break;
                }
              }
            } catch (error) {
              console.error(`Error fetching page ${currentPageNum} for global selection:`, error);
              toast.current?.show({severity:'error', summary: 'Selection Error', detail: `Failed to fetch data for page ${currentPageNum}. Selection may be incomplete.`, life: 5000});
              break;
            }
            currentPageNum++;
          }

          setPersistentSelectedItems(tempPersistentSelections);

          const currentPage = (first / rows) + 1;
          await fetchData(currentPage, rows);

          toast.current?.show({severity:'success', summary: 'Global Selection Updated', detail: `${num - itemsToSelectCounter} rows marked for selection across pages.`, life: 5000});

          setNumRowsToSelect('');
          op.current?.hide();
        }}
      />
    </div>
  );

  return (
    <div style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <Toast ref={toast} />
      <DataTable
        value={data}
        lazy
        paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        dataKey="id"
        selectionMode="checkbox"
        selection={selection}
        onSelectionChange={onSelectionChange}
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field="id" header={codeHeaderTemplate}></Column>
        <Column field="title" header="Title"></Column>
        <Column field="place_of_origin" header="Place of Origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Date Start"></Column>
        <Column field="date_end" header="Date End"></Column>
      </DataTable>

      <OverlayPanel ref={op} id="overlay_panel">
        {overlayPanelContent}
      </OverlayPanel>
    </div>
  );
};

export default ArtDataTable;