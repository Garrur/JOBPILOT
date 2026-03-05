import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Building2, Clock } from 'lucide-react';
import { kanbanData } from '../lib/kanbanData';

export default function Tracker() {
  const [data, setData] = useState(kanbanData.items);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = source.droppableId as keyof typeof data;
    const destCol = destination.droppableId as keyof typeof data;

    const sourceItems = [...data[sourceCol]];
    const destItems = sourceCol === destCol ? sourceItems : [...data[destCol]];

    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    setData({
      ...data,
      [sourceCol]: sourceItems,
      [destCol]: destItems,
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col pt-2 pb-6 px-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Application Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400">Track and manage your job applications.</p>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 h-full">
          {kanbanData.columns.map((column) => (
            <div key={column.id} className="min-w-[300px] flex flex-col bg-gray-50 dark:bg-slate-900/50 rounded-lg overflow-hidden border dark:border-slate-800">
              <div className={`p-3 font-semibold text-sm border-t-4 ${column.color} bg-white dark:bg-slate-800 border-b dark:border-slate-800 flex justify-between items-center`}>
                <span className="dark:text-white">{column.title}</span>
                <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                  {data[column.id as keyof typeof data].length}
                </span>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-grow p-3 space-y-3 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-orange-50/50 dark:bg-slate-800/80' : ''}`}
                  >
                    {data[column.id as keyof typeof data].map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`dark:bg-slate-800 dark:border-slate-700 shadow-sm hover:shadow transition-shadow ${snapshot.isDragging ? 'shadow-lg ring-1 ring-orange-500 opacity-90' : ''}`}
                            style={{ ...provided.draggableProps.style }}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-sm dark:text-white line-clamp-1">{item.title}</h4>
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                  {item.score}%
                                </Badge>
                              </div>
                              <div className="flex items-center text-xs text-gray-500 mb-2">
                                <Building2 className="w-3 h-3 mr-1" />
                                {item.company}
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="flex items-center text-gray-400">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {item.date}
                                </span>
                                <span className="text-gray-400 font-medium">
                                  {item.platform}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
