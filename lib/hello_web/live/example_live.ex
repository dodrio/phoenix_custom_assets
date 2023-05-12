defmodule HelloWeb.ExampleLive do
  use HelloWeb, :live_view

  def render(assigns) do
    ~H"""
    Hello, Example Live.
    """
  end
end
