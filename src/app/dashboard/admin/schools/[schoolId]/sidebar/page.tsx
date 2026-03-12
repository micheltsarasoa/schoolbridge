'use client';

'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrashIcon, PlusIcon } from '@radix-ui/react-icons';
import { useSidebarStore } from './store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SidebarCustomizationPage = ({
  params,
}: {
  params: { schoolId: string };
}) => {
  const {
    config,
    loading,
    error,
    fetchConfig,
    saveConfig,
    addItem,
    removeItem,
    updateItem,
  } = useSidebarStore();

  useEffect(() => {
    fetchConfig(params.schoolId);
  }, [fetchConfig, params.schoolId]);

  const handleSave = () => {
    saveConfig(params.schoolId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Sidebar Customization</CardTitle>
          <CardDescription>
            Customize the sidebar navigation for your school.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            {config.items.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={item.label || ''}
                      onChange={(e) =>
                        updateItem(index, { label: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={item.type}
                      onValueChange={(value) =>
                        updateItem(index, {
                          type: value as 'link' | 'divider' | 'group',
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="link">Link</SelectItem>
                        <SelectItem value="divider">Divider</SelectItem>
                        <SelectItem value="group">Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {item.type === 'link' && (
                    <>
                      <div>
                        <Label>Icon</Label>
                        <Input
                          value={item.icon || ''}
                          onChange={(e) =>
                            updateItem(index, { icon: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Href</Label>
                        <Input
                          value={item.href || ''}
                          onChange={(e) =>
                            updateItem(index, { href: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <Label>Roles</Label>
                    <Input
                      value={item.roles.join(', ')}
                      onChange={(e) =>
                        updateItem(index, {
                          roles: e.target.value
                            .split(',')
                            .map((role) => role.trim()),
                        })
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="outline" onClick={addItem}>
            <PlusIcon className="mr-2" />
            Add Item
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SidebarCustomizationPage;