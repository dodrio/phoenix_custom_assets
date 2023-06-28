defmodule HelloWeb.ExampleLive do
  use HelloWeb, :live_view

  def render(assigns) do
    ~H"""
    <div class="font-sans">
      Hello, font-sans.
    </div>

    <div class="font-mono">
      Hello, font-mono.
    </div>
    """
  end
end
