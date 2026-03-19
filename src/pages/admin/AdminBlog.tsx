import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const API = "http://localhost:3000/blogs";

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    featured_image: "",
    meta_title: "",
    meta_description: "",
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const data = await res.json();
      setBlogs(data.data);
    } catch {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      content: "",
      featured_image: "",
      meta_title: "",
      meta_description: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    try {
      if (!form.title || !form.slug) {
        return toast.error("Title & slug required");
      }

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API}/${editingId}` : API;

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      toast.success(editingId ? "Blog updated" : "Blog created");
      resetForm();
      fetchBlogs();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (blog: any) => {
    setEditingId(blog.id);
    setForm(blog);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      toast.success("Blog deleted");
      fetchBlogs();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Blog" : "Create Blog"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
          <Input name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} />
          <Input name="featured_image" placeholder="Featured Image URL" value={form.featured_image} onChange={handleChange} />
          <Input name="meta_title" placeholder="Meta Title" value={form.meta_title} onChange={handleChange} />
          <Textarea name="meta_description" placeholder="Meta Description" value={form.meta_description} onChange={handleChange} />
          <Textarea name="content" placeholder="Content" rows={6} value={form.content} onChange={handleChange} />

          <div className="flex gap-2">
            <Button onClick={handleSubmit}>
              {editingId ? "Update" : "Create"}
            </Button>
            {editingId && (
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <p>Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p>No blogs found</p>
        ) : (
          blogs.map((blog) => (
            <Card key={blog.id} className="shadow-md">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold">{blog.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {blog.content}
                </p>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => handleEdit(blog)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(blog.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
